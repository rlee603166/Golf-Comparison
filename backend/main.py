import os
from flask import Flask, request, jsonify, url_for, send_file
from flask_cors import CORS
from moviepy.editor import VideoFileClip
from PIL import Image

import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from helpers.movenet_helpers import _keypoints_and_edges_for_display
from helpers.vid_helpers import init_crop_region, determine_crop_region, run_inference
from helpers.data_processors import center_pts, convert_to_json



app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
PROCESSED_FOLDER = os.path.join(os.getcwd(), 'processed')
PREDICTED_FOLDER = os.path.join(os.getcwd(), 'predicted')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['PREDICTED_FOLDER'] = PREDICTED_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(PREDICTED_FOLDER, exist_ok=True)


model_name = 'movenet_thunder'

if model_name == 'movenet_lightning':
    module = hub.load('https://tfhub.dev/google/movenet/singlepose/lightning/4')
    input_size = 192
elif model_name == 'movenet_thunder':
    module = hub.load('https://tfhub.dev/google/movenet/singlepose/thunder/4')
    input_size = 256
else:
    raise ValueError("Unsupported model_name name: %s" % model_name)


def movenet(input_image):
    model = module.signatures['serving_default']

    # SavedModel format expects tensor type of int32.
    input_image = tf.cast(input_image, dtype=tf.int32)
    # Run model inference.
    outputs = model(input_image)
    # Output is a [1, 1, 17, 3] tensor.
    keypoints_with_scores = outputs['output_0'].numpy()
    return keypoints_with_scores

def predict(gif):
    num_frames, org_height, org_width, _ = gif.shape
    crop_region = init_crop_region(org_height, org_width)
    kps_edges = []
    
    for i in range(num_frames):
        kps_scores = run_inference(
            movenet,
            gif[i, :, :, :],
            crop_region,
            crop_size=[input_size, input_size]
        )
        kps_edges.append(_keypoints_and_edges_for_display(
            kps_scores,
            org_height,
            org_width
        ))
        crop_region = determine_crop_region(
            kps_scores, 
            org_height, 
            org_width
        )
    return kps_edges



@app.route("/")
def hello_world():
    return "Hello World!"

@app.route("/upload", methods=['GET', 'POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file found'}), 400
    video = request.files['file']
    if video.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if video and video.filename.endswith('.mp4'):
        path = os.path.join(app.config['UPLOAD_FOLDER'], video.filename)
        video.save(path)

        gif_name = f'{os.path.splitext(video.filename)[0]}.gif'
        gif_path = os.path.join(app.config['PROCESSED_FOLDER'], gif_name)
        video = VideoFileClip(path)
        video.write_gif(gif_path)
        
        print("Video saved at:", path)
        print("GIF saved at:", gif_path)

        # Check if the files exist
        if os.path.exists(path):
            print("Video file exists.")
        if os.path.exists(gif_path):
            print("GIF file exists.")

        gif_url = url_for('get_gif', filename=gif_name, _external=True)

        return jsonify({'gif_url': gif_url})
    else:
        return jsonify({'error': 'Video not supported'}), 400

@app.route("/gif/<filename>", methods=['GET', 'POST'])
def get_gif(filename):
    path = os.path.join(app.config['PROCESSED_FOLDER'], filename)
    return send_file(path, mimetype='image/gif')

@app.route("/predict/<gif_name>", methods=['GET'])
def handle_prediction(gif_name):
    gif_path = os.path.join(app.config['PROCESSED_FOLDER'], f'{gif_name}.gif')
    gif = tf.io.read_file(gif_path)
    gif = tf.image.decode_gif(gif)
    
    kps_edges = predict(gif)
    
    keypoints, edges = center_pts(kps_edges)
    
    json_kps = [convert_to_json(keypoint, edge) for keypoint, edge in zip(keypoints, edges)]
    
    return  jsonify(json_kps)

@app.route("/processed/<filename>", methods=['GET', 'POST'])
def get_predicted(filename):
    path = os.path.join(app.config['PREDICTED_FOLDER'], filename)

    return send_file(path, mimetype='image/gif')
    

if __name__ == "__main__":
    app.run(debug=True)