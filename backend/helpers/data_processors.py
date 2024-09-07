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
        centered_kps = kps_arr[i][0] - np.array([centroid_x, 0])
        x = centered_kps[:, 0]
        y = centered_kps[:, 1]
        y_normalized = (y - np.min(y)) / (np.max(y) - np.min(y))
        x_normalized = (x - np.min(y)) / (np.max(y) - np.min(y))

        normalized_keypoints = np.column_stack((x_normalized, y_normalized))

        edges = kps_arr[i][1]
        shifted = edges - np.array([centroid_x, 0])
        edges_x = shifted[:, :, 0]  # Extract x-coordinates of edges (unchanged)
        edges_y = shifted[:, :, 1]  # Extract y-coordinates of edges
        
        # Normalize only the y-coordinates of the edges using the same y normalization as keypoints
        edges_y_normalized = (edges_y - np.min(y)) / (np.max(y) - np.min(y))
        edges_x_normalized = (edges_x - np.min(y)) / (np.max(y) - np.min(y))
        
        # Combine the x-coordinates and normalized y-coordinates for edges
        normalized_edges = np.stack([edges_x_normalized, edges_y_normalized], axis=-1)

        centered_keypoints.append(normalized_keypoints)
        centered_edges.append(normalized_edges.reshape(edges.shape))
    
    return centered_keypoints, centered_edges
