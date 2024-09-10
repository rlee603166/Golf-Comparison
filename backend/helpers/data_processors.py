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
    
    last_valid_xy = None
    
    for i in range(num_frames):
        keypoints = kps_arr[i][0]
        num_pts += len(keypoints)
        centroid_x += sum(keypoints[:, 0])
        centroid_y += sum(keypoints[:, 1])


    centroid_x /= num_pts
    centroid_y /= num_pts
    
    centered_keypoints = []
    

    for i in range(num_frames):
        front_xy = kps_arr[i][0]

        # Cache or replace missing points in front_xy
        if len(front_xy) < 17:
            if last_valid_xy is not None:
                front_xy = last_valid_xy
            else:
                front_xy = np.insert(front_xy, 10, [[front_xy[9, 0] - 1, front_xy[9, 1] - 1]], axis=0)
                
            print(len(front_xy))
        else:
            last_valid_xy = front_xy 
        
        centered_kps = front_xy - np.array([0, 0])
        x = centered_kps[:, 0]
        y = centered_kps[:, 1]
        x_normalized = (x - np.min(y)) / (np.max(y) - np.min(y))
        y_normalized = (y - np.min(y)) / (np.max(y) - np.min(y))
        y_inverted = np.max(y_normalized) - y_normalized


        x_centered = x_normalized - np.max(x_normalized) + ((np.max(x_normalized) - np.min(x_normalized)) / 2)

        normalized_keypoints = np.column_stack((x_centered, y_inverted))
        centered_keypoints.append(normalized_keypoints)
    
    return centered_keypoints

def recursive_convert_to_list(data):
    if isinstance(data, np.ndarray):
        return data.tolist()
    elif isinstance(data, list):
        return [recursive_convert_to_list(item) for item in data]
    elif isinstance(data, dict):
        return {key: recursive_convert_to_list(value) for key, value in data.items()}
    return data