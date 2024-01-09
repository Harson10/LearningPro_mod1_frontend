// // components/Module/CreateModule.tsx
// import React, { useState } from 'react';

// const CreateModule: React.FC = () => {
//   const [titre, setTitre] = useState('');
//   const [description, setDescription] = useState('');

//   const handleCreateModule = () => {
//     // Effectue l'appel API pour créer un nouveau module avec les données actuelles.
//   };

//   return (
//     <div>
//       <h2>Créer un nouveau module</h2>
//       <form>
//         <label>Titre</label>
//         <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} />
//         <label>Description</label>
//         <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
//         <button type="button" onClick={handleCreateModule}>Créer</button>
//       </form>
//     </div>
//   );
// };

// export default CreateModule;


// // // components/Module/CreateModule.tsx 
// // import React, { useState } from 'react'; 

// // const CreateModule: React.FC = () => { 
// //     const [titre, setTitre] = useState(''); 
// //     const [description, setDescription] = useState(''); 
// //     const handleCreateModule = () => { 
// //         // Effectue l'appel API pour créer un nouveau module avec les données actuelles. 
// //     }; 
    
// //     return ( 
// //         <div> 
// //             <h2>Créer un nouveau module</h2> 
// //             <form> 
// //                 <label>Titre</label> 
// //                 <input 
// //                     type="text" 
// //                     value={titre} 
// //                     onChange={
// //                         (e) => setTitre(e.target.value)
// //                     } 
// //                 /> 
// //                 <label>Description</label> 
// //                 <textarea 
// //                     value={description} 
// //                     onChange={(e) => setDescription(e.target.value)} 
// //                 /> 
// //                 <button 
// //                     type="button" 
// //                     onClick={
// //                         handleCreateModule
// //                     }
// //                 >
// //                     Créer
// //                 </button> 
// //             </form> 
// //         </div> 
// //     ); 
// // }; 

// // export default CreateModule; 