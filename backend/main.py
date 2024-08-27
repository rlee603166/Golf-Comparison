import os
from flask import Flask, request, jsonify, url_for, send_file
from moviepy.editor import VideoFileClip

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
PROCESSED_FOLDER = os.path.join(os.getcwd(), 'processed')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

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

        gif_url = url_for('get_gif', filename=gif_name, _external=True)

        return jsonify({'gif_url': gif_url})
    else:
        return jsonify({'error': 'Video not supported'}), 400

@app.route("/gif/<filename>", methods=['GET', 'POST'])
def get_gif(filename):
    path = os.path.join(app.config['PROCESSED_FOLDER'], filename)
    # @after_this_request
    # def remove_file(response):
    #     try:
    #         os.remove(path)
    #     except Exception as e:
    #         app.logger.error(e)
    #     return response
    return send_file(path, mimetype='image/gif')

if __name__ == "__main__":
    app.run(debug=True)