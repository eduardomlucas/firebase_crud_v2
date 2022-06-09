import React from 'react';
import {useState, useEffect} from "react";
import './App.css';
//import from my firebase data storage
import {db} from './firebase-config';
import {collection, doc, getDocs, addDoc, updateDoc, deleteDoc} from "firebase/firestore";

function App() {
  //seting the value to use to insert in the database (name)
  const [newManga, setNewManga] = useState("");
  //seting the value to use to insert in the database (cap)
  const [newCap, setNewCap] = useState(0);
  //seting the value (obj)
  const [mangas, setMangas]= useState([]);
  //setting wich collection I will show 
  const mangasCollectionRef = collection(db, "mangas");
  //each time that the page render, this function will be called
  
  const createMangas = async () =>{
    await addDoc(mangasCollectionRef, {name: newManga, cap: Number(newCap)});
  }
  
  const updateManga =async (id, cap) => {
    const mangaDoc = doc(db, "mangas", id);
    const newFields ={cap: cap + 1};
    await updateDoc(mangaDoc,newFields)
  }

  const deleteManga = async (id) => {
    const mangaDoc = doc(db, "mangas", id);
    await deleteDoc(mangaDoc)
  }

  useEffect(() =>{
    const getMangas = async()=> {
      const data = await getDocs(mangasCollectionRef);
      //console.log(data);
      setMangas(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
    };

    getMangas();

  }, []);
  
  return(
    <div className="App"> 
      <input 
        type="text"
        placeholder="nome.."
        onChange={(event) => {
          setNewManga(event.target.value)
        }}
      />
      <input 
        type="text"
        placeholder="capitulo.."
        onChange={(event) => {
          setNewCap(event.target.value)
        }}
      />
      <button onClick={createMangas}>Create Manga</button>
      {mangas.map((manga) => {
        return (
          <div>
            {" "}
            <h1>Name: {manga.name}</h1>
            <h1>Cap: {manga.cap}</h1>
            <button onClick={()=>(updateManga(manga.id, manga.cap))}>Increase Cap.</button>
            <button onClick={()=>{deleteManga(manga.id)}}>Delete Manga</button>
          </div>
          
        );  
      })} 
    </div>
  );

}

export default App;