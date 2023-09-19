'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';

export default function Home() {

  const MODEL_PATH = 'model/model.json';
  let model;

  useEffect(() => {
    async function loadModel() {
        model = await tf.loadLayersModel(MODEL_PATH);
        const fileInput = document.getElementById('file');
        const classifyButton = document.getElementById('classifyBtn');
        const clearButton = document.getElementById('clearBtn');
        const imgElement = document.getElementById('img');
        const resultElement = document.getElementById('result');

        if (!fileInput || !classifyButton || !clearButton || !imgElement || !resultElement) {
            console.error('File input, classify button, clear button, img, or result element not found.');
            return;
        }

        classifyButton.addEventListener('click', async function () {
            const file = fileInput.files[0];
            if (!file) {
                console.error('No image file selected.');
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            imgElement.src = imageUrl;
        });

        imgElement.onload = async function () {
            const img = tf.browser.fromPixels(imgElement).toFloat();
            const resizedImg = tf.image.resizeBilinear(img, [256, 256]).expandDims(0).div(255);
            const pred = model.predict(resizedImg);
            const prediction = pred.arraySync()[0][0];
            const resultText = prediction > 0.5 ? 'Dog' : 'Cat';
            resultElement.innerHTML = `The image you've provided is: ${resultText}, Confidence: ${Math.round(
                prediction * 100
            )}%`;
        };

        clearButton.addEventListener('click', function () {
            fileInput.value = '';
            imgElement.src = '';
            resultElement.innerHTML = '';
        });
    }

    loadModel();
}, []);


  return (
    <>
      <head>
        <title>Dog vs Cat Classifier</title>
      </head>

      <img id="img" className="sm w-1/4 h-1/4" src="" alt="Classified Image" />

      <div className="mt-16 flex w-screen content-center justify-center items-center">
        <h1 className="text-7xl">&#128054;</h1>
        <h1 className="text-7xl -ml-5">&#128049;</h1>
      </div>

      <div className="grid gap-6">
        <div className="bg-2d2d2d w-80 h-14 ml-5 mt-96 text-white rounded-lg p-2 border-none outline-none">
          <h1 className="text-xl font-medium text-center mt-1 font-inter">Choose Image</h1>
          <input type="file" id="file" className="opacity-0"/>
        </div>
        <div className="flex gap-8">
          <div className="bg-red-700 opacity-90 w-36 h-14 ml-5 rounded-lg p-2 border-none outline-none">
            <h1 className="text-xl font-medium text-center mt-1 font-inter text-white">Clear</h1>
            <motion.button id="clearBtn">Clear</motion.button>
          </div>
          <div className="bg-green-700 opacity-90 w-36 h-14 rounded-lg p-2 border-none outline-none">
            <h1 className="text-xl font-medium text-center mt-1 font-inter text-white">Classify</h1>
            <motion.button id="classifyBtn">Classify</motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
