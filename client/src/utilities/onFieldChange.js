const onFieldChange = (e) => {
    const { name, value } = e.target;
    return({ [name]: value });
  };
  
  export default onFieldChange;