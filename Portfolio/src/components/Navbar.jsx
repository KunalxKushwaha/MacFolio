import React from 'react'

const Navbar = () => {

    const data = [
            {id: 1, name: "Portfolio"},
            {id: 2, name: "Contact"},
            {id: 3, name: "Projects"},
        ];
  return (
   <nav>
     <div>
      <img src="/images/logo.svg" alt="logo" />
      <p className='font-bold'>Kunal's Portfolio</p>

      <ul>
        {data.map(({id,name}) => (
            <li key={id}>
                <p>{name}</p>
            </li>
        ))}
      </ul>
    </div>
   </nav>
  )
}

export default Navbar
