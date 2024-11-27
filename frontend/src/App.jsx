import React, { useState } from 'react';
import axios from 'axios';
import { FaRegFileImage } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';

const App = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setError(null); // Clear previous errors
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      setError('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data);
      setError(null); // Clear previous errors
    } catch (err) {
      setError('Error predicting the pest. Please try again later.');
      setPrediction(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewURL(null);
  };

  // Set preview URL for image
  React.useEffect(() => {
    if (typeof image === "string") {
      setPreviewURL(image);
    } else if (image) {
      setPreviewURL(URL.createObjectURL(image));
    } else {
      setPreviewURL(null);
    }

    return () => {
      if (previewURL && typeof previewURL === "string" && !image) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [image]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Pest Detection System</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {!image ? (
              <label htmlFor="imageUpload" className="block w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50 cursor-pointer">
                <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
                  <FaRegFileImage className="text-xl text-cyan-500"/>
                </div>
                <p className="text-sm text-slate-500">Browse Image file to upload</p>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="w-full relative">
                <img 
                  src={previewURL} 
                  alt="Selected"
                  className="w-full h-[300px] object-cover rounded-lg" 
                />
                <button 
                  className="btn-small btn-delete absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <MdDeleteOutline className="text-lg text-white"/>
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
            >
              Predict Pest
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {prediction && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-blue-600">Prediction Result:</h2>
            <p><strong>Pest:</strong> {prediction.pest}</p>
            <p><strong>Lifecycle:</strong> {prediction.lifecycle}</p>
            <p><strong>Control Measures:</strong> {prediction.control_measures}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
