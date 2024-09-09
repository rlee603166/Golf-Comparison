import numpy as np


def convert_to_json(keypoints, edges):
    return {
        'keypoints': keypoints.tolist(),
        'edges': edges.tolist()
    }
    
def center_pts(kps_arr):
    num_frames = len(kps_arr)
    
    centroid_x = 0
    centroid_y = 0
    num_pts = 0
    
    for i in range(num_frames):
        keypoints = kps_arr[i][0]
        num_pts += len(keypoints)
        centroid_x += sum(keypoints[:, 0])
        centroid_y += sum(keypoints[:, 1])


    centroid_x /= num_pts
    centroid_y /= num_pts
    
    centered_keypoints = []
    centered_edges = []
    

    for i in range(num_frames):
        centered_kps = kps_arr[i][0] - np.array([0, 0])
        x = centered_kps[:, 0]
        y = centered_kps[:, 1]
        x_normalized = (x - np.min(y)) / (np.max(y) - np.min(y))
        y_normalized = (y - np.min(y)) / (np.max(y) - np.min(y))
        y_inverted = np.max(y_normalized) - y_normalized


        x_centered = x_normalized - np.max(x_normalized) + ((np.max(x_normalized) - np.min(x_normalized)) / 2)

        normalized_keypoints = np.column_stack((x_centered, y_inverted))

        edges = kps_arr[i][1]
        shifted = edges - np.array([centroid_x, centroid_y])
        edges_x = shifted[:, :, 0]
        edges_y = shifted[:, :, 1]
        
        edges_y_normalized = (edges_y - np.min(y)) / (np.max(y) - np.min(y))
        inverted_y_edges = np.max(edges_y_normalized) - edges_y_normalized
        
        edges_x_normalized = (edges_x - np.min(y)) / (np.max(y) - np.min(y))
        edges_x_centered = edges_x_normalized - np.max(edges_x_normalized) + ((np.max(edges_x_normalized) - np.min(edges_x_normalized)) / 2)
        
        normalized_edges = np.stack([edges_x_centered, inverted_y_edges], axis=-1)

        centered_keypoints.append(normalized_keypoints)
        centered_edges.append(normalized_edges.reshape(edges.shape))
    
    return centered_keypoints, centered_edges

def recursive_convert_to_list(data):
    if isinstance(data, np.ndarray):
        return data.tolist()
    elif isinstance(data, list):
        return [recursive_convert_to_list(item) for item in data]
    elif isinstance(data, dict):
        return {key: recursive_convert_to_list(value) for key, value in data.items()}
    return data