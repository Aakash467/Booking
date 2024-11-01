import React, { useEffect, useState } from 'react'
import {Navigate, useParams} from 'react-router-dom'
import Perks from './Perks';
import axios from 'axios';
import AccountNav from './AccountNav';

export default function PlacesFormPage() {
    const {id} = useParams();
  const [title,setTitle] = useState('');
  const [address,setAddress] = useState('');
  const [addedPhotos,setAddedPhotos] = useState([]);
  const [photoLink,setPhotoLink] = useState('');
  const [description,setDescription] = useState('');
  const [perks,setPerks] = useState([]);
  const [extraInfo,setExtraInfo] = useState('');
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [maxGuests,setGuests] = useState(1);
  const [price,setPrice] = useState(100)
  const [redirect, setRedirect] = useState(false);

  useEffect(()=>{
    if(!id){
        return;
    }
    axios.get('/places/'+id).then((response)=>{
        const {data} = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description)
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setGuests(data.maxGuests);
        setPrice(data.price);
    })
  },[id]);

  async function addPhoto(e){
    e.preventDefault();
    const {data:filename} = await axios.post('/upload-by-link',{link : photoLink})
    setAddedPhotos(prev=>{
      return [...prev,filename];
    })
    setPhotoLink('');
  }

  function handleUpload(e) {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
        data.append('photos', files[i]);
    }

    axios.post('/uploads', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
        const { data: filenames } = response;
        setAddedPhotos(prev => [...prev, ...filenames]);
    })
    .catch(error => {
        console.error('Error uploading files:', error);
    });
}

  async function savePlace (e){
    e.preventDefault();
    if(id){
        await axios.put('/places',{
            id,title, address, photos:addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
        },{withCredentials:true});
    }else{
        await axios.post('/places',{
            title, address, photos:addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
        },{withCredentials:true});
    }
    
    setRedirect(true);
  }

  if(redirect){
    return <Navigate to={'/account/places'}/>
  }

  function removePhoto(e,link){
    e.preventDefault();
    const arr = addedPhotos;
    const newArr = arr.filter(photo => photo!==link);
    setAddedPhotos(newArr);
  }
  return (
    <div>
        <AccountNav/>
      <div className='mt-10'>
          <form onSubmit={savePlace} className="max-w-xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
    
            <div className="mb-6">
              <h1 className="text-lg font-semibold text-gray-800">Title</h1>
              <p className="text-sm text-gray-600 mb-2">Title for your place, should be short and catchy</p>
              <input 
              type="text" 
              placeholder="Enter here" value={title} onChange={e=>setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-6">
              <h1 className="text-lg font-semibold text-gray-800">Address</h1>
              <p className="text-sm text-gray-600 mb-2">Address of this place</p>
              <input 
                type="text" 
                placeholder="Enter here" value={address} onChange={e=>setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-6">
              <h1 className="text-lg font-semibold text-gray-800">Photos</h1>
              <p className="text-sm text-gray-600 mb-2">More photos = better</p>
              <div className="flex gap-2">
                <input 
                  type="text" value={photoLink} onChange={e=>setPhotoLink(e.target.value)}
                  placeholder="Photo URL" 
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  type="button" onClick={addPhoto}
                  className="bg-primary text-white px-4 rounded-lg"
                  >
                  Add
                </button>
              </div>
              {addedPhotos.length > 0 && addedPhotos.map((link, index) => (
                <div className='relative w-20 h-20 m-2' key={index}>
                    <img className='w-full h-full rounded-md' src={'http://localhost:4000/uploads/' + link} />
                    <button onClick={()=>{removePhoto(link)}} className='absolute bottom-1 right-1 bg-black text-white rounded p-1 cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9L14.394 18m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    </button>
                </div>
                ))}
              <div className='mt-6 inline-flex'>
                <label className="flex flex-row gap-1 items-center cursor-pointer py-2 px-4  bg-primary text-white rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <div> Upload</div> 
                  <input multiple type='file' className='hidden' onChange={handleUpload}></input>
                </label>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Description</h1>
              <p className="text-sm text-gray-600 mb-2">description of the place</p>
              <textarea value={description} onChange={e=>setDescription(e.target.value)}
              placeholder="Enter description here..." 
              className="w-full h-32 p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
            </div>
            <Perks selected={perks} onChange={setPerks} />
            <div className='mt-6'>
              <h1 className="text-lg font-semibold text-gray-800">Extra Info</h1>
              <p className="text-sm text-gray-600 mb-2">house rules, etc</p>
              <textarea value={extraInfo} onChange={e=>setExtraInfo(e.target.value)}
              placeholder="Right here..." 
              className="w-full h-20 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
            </div>
            <div className="mt-6 space-y-4">
                <h1 className="text-lg font-semibold text-gray-800">Check-in & Check-out Times</h1>
                <p className="text-sm text-gray-600">Add check-in and check-out times</p>

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Check-in</label>
                    <input 
                        type="text" value={checkIn} onChange={e=>setCheckIn(e.target.value)}
                        placeholder="e.g., 2:00 PM" 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                    />
                </div>

                
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Check-out</label>
                    <input 
                        type="text" value={checkOut} onChange={e=>setCheckOut(e.target.value)}
                        placeholder="e.g., 11:00 AM" 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                    />
                </div>
              
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Number of Guests</label>
                    <input 
                        type="text" value={maxGuests} onChange={e=>setGuests(e.target.value)}
                        placeholder="e.g., 2" 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>
            <div className="mt-6 space-y-4">
            <h1 className="text-lg font-semibold text-gray-800">Price per night</h1>
                <input 
                  type="text" value={price} onChange={e=>setPrice(e.target.value)}
                  placeholder="e.g., 2" 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-primary focus:border-primary"/>
                </div>
            <button className='mt-6 bg-primary text-white py-2 px-6 w-full rounded-full '>Save</button>
          </form>

        </div>
    </div>
  )
}
