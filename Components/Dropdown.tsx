"use client"
import React, { useEffect, useState, useRef } from 'react';
import { OptionsForDropdown } from '@/Constant';
import { optionsTypes } from '@/types/OptionsTypes';


function Dropdown() {
  const [selectedOptions, setSelectedOptions] = useState<optionsTypes[] | []>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | null>(null);
  const [focusedSelectedOptionIndex, setFocusedSelectedOptionIndex] = useState<number | null>(null);
  const [availableOptions, setAvailableOptions] = useState<optionsTypes[] | []>([])

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLInputElement | null>(null);
  const isOptionSelected = (option: optionsTypes) => {
    return selectedOptions.some(selected => selected.name === option.name);
  };

  const handleKeyDown = (e: { key: string; }) => {
  if (e.key === 'ArrowDown') {
    setFocusedOptionIndex(prevIndex =>
      prevIndex === null || prevIndex >= availableOptions.length - 1 ? 0 : prevIndex + 1
    );
  } else if (e.key === 'ArrowUp') {
    setFocusedOptionIndex(prevIndex =>
      prevIndex === null || prevIndex <= 0 ? availableOptions.length - 1 : prevIndex - 1
    );
  } else if (e.key === 'Enter' && focusedOptionIndex !== null) {
    const selectedOption = availableOptions[focusedOptionIndex];
    toggleOption(selectedOption);
    setFocusedOptionIndex(null);
    if (inputRef.current) {
      inputRef.current.focus();
      setShowDropdown(true)
    }
  } else if (e.key === 'Backspace' && inputValue === '') {
    if (focusedSelectedOptionIndex === null) {
      setFocusedSelectedOptionIndex(selectedOptions.length - 1);
    } else {
      removeOption(selectedOptions[focusedSelectedOptionIndex].name);
      setFocusedSelectedOptionIndex(null);
      setFocusedOptionIndex(null);
      if (inputRef.current) {
        inputRef.current.focus();
        setShowDropdown(true)
      }
    }
  } if (e.key === "Escape") {
    setShowDropdown(false);
    return;
  }

};

useEffect(() => {
  const handleClickOutside = (event :any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [dropdownRef]);

//when the option from dropdown is selected

const toggleOption = (option: optionsTypes) => {
  console.log("from selected", option)
  // event.stopPropagation();
  if (!isOptionSelected(option)) {
   
    setSelectedOptions([...selectedOptions, option]);
  }
  setShowDropdown(false);
  setSearchQuery('');
  setInputValue('');
  if (inputRef.current) {
    inputRef.current.focus();
    setShowDropdown(true)
  }
  return;
};



// Function to remove selected option
const removeOption = (optionName: string) => {
  setSelectedOptions(selectedOptions.filter(option => option.name !== optionName));
  if (inputRef.current) {
    inputRef.current.focus();
    setShowDropdown(true)
  }
};

// Filter the available options
useEffect(() => {
  let newAvailableOptions: optionsTypes[];
  if(searchQuery.length === 0){
    newAvailableOptions = OptionsForDropdown.filter(option => 
    !selectedOptions.some(selected => selected.name === option.name)
  )
  }else{
    let newQueriedAvailableOptions = OptionsForDropdown
    .filter(option => !selectedOptions.some(selected => selected.name === option.name))
    .filter(option => option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.email.toLowerCase().includes(searchQuery.toLowerCase()))
    if(newQueriedAvailableOptions.length === 0){
      newAvailableOptions = []
    }else{
      newAvailableOptions = newQueriedAvailableOptions;
    }
  }
 
  setAvailableOptions(newAvailableOptions);
}, [selectedOptions, inputValue, searchQuery, availableOptions])

 

return (
  <>

    <div className=" p-[5px] border-b-2 w-[70vw] border-blue-700"

    >
      <div className="flex flex-wrap items-center mx-[3px]" onClick={() => setShowDropdown(true)}>
        {selectedOptions.map((option, index) => (
        <span key={option.name} className={`bg-[#e0e0e0] p-[5px] py-[6px] rounded-xl m-[2px] flex items-center gap-[10px] justify-between ${focusedSelectedOptionIndex === index ? 'border-2 border-blue-700' : ''}`}>
            <div className='flex gap-2 items-center justify-center'>
              <img className='rounded-full h-[25px] w-[25px]' src={option.pic} />
              <p className='text-[0.8rem] text-gray-500'>{option.name}</p>
            </div>

            <button type="button" className='' onClick={() => removeOption(option.name)}>x</button>
          </span>
        ))}
        <div className='relative flex-grow'>
          {
           <input
              type="text"
              value={inputValue}
              ref={inputRef}
              onChange={e => {
                console.log(e.target.value)
                setInputValue(e.target.value)
                setSearchQuery(e.target.value);
                setFocusedSelectedOptionIndex(null);
              }}
              list='data'
              onKeyDown={handleKeyDown}
              placeholder='Add User..'
              style={{ border: 'none', outline: 'none' }}
            />
          }



          {showDropdown &&
          (
          availableOptions.length > 0 ?
            <div  ref={dropdownRef} style={{ width: "500px", maxHeight: "500px" }} className="dropdown-menu absolute mt-[2vh] top-[100%] overflow-auto rounded-md">
              {availableOptions.map((option, index) => (
                <div key={index} onClick={(event) => toggleOption(option)} className={`p-3 border-b hover:bg-slate-100 flex items-center justify-between ${focusedOptionIndex === index ? 'bg-slate-200' : ''}`}>
                  <div className='flex justify-center gap-5 items-center'>
                    <img src={option.pic} className='rounded-full h-[50px] w-[50px]' alt={option.name} />
                    <p className='text-[1rem] text-gray-700'>{option.name}</p>
                  </div>
                  <div>
                    <p className='text-[0.8rem] text-gray-500'>{option.email}</p>
                  </div>
                </div>
              ))}

            </div>
        : 
        <div style={{ width: "500px", maxHeight: "500px" }} className="dropdown-menu absolute p-3 mt-[2vh] top-[100%] overflow-auto rounded-md">
       
           <p>No Options Found</p>
          </div>)
          } </div>
      </div>
    </div>



  </>
);
}

export default Dropdown;



