import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Audio } from 'react-loader-spinner';

import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';

import { fetchImages } from '../API';

import '../App.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (query !== '') {
      setPage(1);
      fetchImages(query, 1)
        .then((fetchedImages) => {
          if (fetchedImages.length === 0) {
            toast.error(`No images found for ${query}`);
          }
          setImages(fetchedImages);
          setPage((prevPage) => prevPage + 1);
        })
        .catch((fetchError) => setError(fetchError))
        .finally(() => setIsLoading(false));
    }
  }, [query]);

  const handleFormSubmit = (newQuery) => {
    setQuery(newQuery);
    setImages([]);
    setError(null);
    setPage(1);
  };

  const fetchMoreImages = () => {
    setIsLoading(true);
    fetchImages(query, page)
      .then((fetchedImages) => {
        setImages((prevImages) => [...prevImages, ...fetchedImages]);
        setPage((prevPage) => prevPage + 1);
      })
      .catch((fetchError) => setError(fetchError))
      .finally(() => setIsLoading(false));
  };

  const openModal = (largeImageUrl) => {
    setShowModal(true);
    setLargeImageURL(largeImageUrl);
  };

  const closeModal = () => {
    setShowModal(false);
    setLargeImageURL('');
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 24,
      }}
    >
      <Searchbar onSubmit={handleFormSubmit} />

      {error && <p>Whoops, something went wrong: {error.message}</p>}

      <ImageGallery images={images} onImageClick={openModal} />

      {isLoading && (
        <Audio
          height={80}
          width={80}
          radius={9}
          color="green"
          ariaLabel="three-dots-loading"
          wrapperStyle=""
          wrapperClass=""
        />
      )}

      {images.length > 0 && !isLoading && <Button onClick={fetchMoreImages} />}

      {showModal && (
        <Modal src={largeImageURL} alt="Large Image" onClose={closeModal} />
      )}

      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
};

export default App;
