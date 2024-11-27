import requests

url = "http://127.0.0.1:5000/predict"
file_path = r'C:\Users\NN\Pictures\Screenshots\Screenshot 2024-11-15 023123.png'  # Make sure the file path is correct

# Send the file via POST request
with open(file_path, "rb") as file:
    response = requests.post(url, files={"file": file})

# Print the response from the API
print(response.json())
