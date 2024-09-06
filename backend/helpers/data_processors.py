import numpy as np


def convert_to_json(keypoints, edges):
    return {
        'keypoints': keypoints.tolist(),
        'edges': edges.tolist()
    }
    
def center_pts(kps_arr):
    num_frames = len(kps_arr)
    
    centroid_x = 0
    num_pts = 0
    
    for i in range(num_frames):
        keypoints = kps_arr[i][0]
        num_pts += len(keypoints)
        centroid_x += sum(keypoints[:, 0])


    centroid_x /= num_pts
    
    centered_keypoints = []
    centered_edges = []
    

    for i in range(num_frames):
        keypoints = kps_arr[i][0]
        edges = kps_arr[i][1]

        centered_keypoints.append(keypoints - np.array([centroid_x, 0]))
        
        reshaped = edges.reshape(-1, 2)
        shifted = reshaped - np.array([centroid_x, 0])
        centered_edges.append(shifted.reshape(edges.shape))
    
    return centered_keypoints, centered_edges