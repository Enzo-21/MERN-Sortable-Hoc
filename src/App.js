import React, { useState, useEffect } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import axios from 'axios'
import { BASE_URL } from './config'
import Navbar from './Navbar';

import './App.css'

const SortableItem = SortableElement(({ title, description, _id }) => {
  return (
    <li className='list-group-item item my-3'>
      
  <h1>{title}</h1>
      <p>{description}</p>
{/*   <p>{_id}</p> */}
    </li>
  )
})

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul className='list-group'>
      {items.map((task, i) => (
        <SortableItem {...task} index={i} key={i} /> //Using spread operator to pass a copy of the task props 
      ))}
    </ul>
  )
})

const SortableTasks = () => {
  const [tasks, setTasks] = useState([])

  const fetchData = async () => {
    const {data} = await axios.get(`${BASE_URL}tasks`)
    
    data.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
    
    setTasks(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onSortEnd = async ({ oldIndex, newIndex }) => {

    let tasksCopy = [...tasks]
    tasksCopy = arrayMove(tasksCopy, oldIndex, newIndex)
    setTasks(tasksCopy)

    const taskIds = tasksCopy.map(task => task._id)


    await axios({
      method: 'put',
      url: `${BASE_URL}tasks`,
      data: taskIds
    });

   

  }

  return (tasks) ? (
    <SortableList items={tasks} onSortEnd={onSortEnd} />
  ) : (
    <p>Loading...</p>
  )

}


const App = () => {
  return (
    <>
    <Navbar/>
 
    
     <div className="container">
       <div className="jumbotron text-center mt-4 p-2">
       <h4>How it works... 🤔</h4>
     <p>You can drag the elements to sort them as you like, they will be automatically updated on the database</p>
     <small>(Backend is served on a free Heroku tier so elements may take a while to load, be patient 😅)</small>
       </div>
  
      <div className="row">
        <div className="col-12">
          <SortableTasks />
        </div>

      </div>
    
    </div>
    </>
   
  );
}

export default App;
