module.exports = ({ name, amount, totalProducts, redirectDomain }) => {
  return `
  <html>
  <head>
      <style>
        .container{
          font-family: "Nunito", sans-serif;
          font-size: 1.1rem;         
          display: grid;
          grid-template-columns: max-content;
          justify-content: center;
        }

        .name{
          font-weight: bold;
          text-transform: capitalize;
        }
       
        li{
          list-style: none;
          font-weight: bold;
        }
     
      </style>
    <!-- Google fonts -->
    <link
      href="https://fonts.googleapis.com/css?family=Josefin+Sans:300,400,400i|Nunito:300,300i"
      rel="stylesheet"
    />
    </head>
      <body>
        <div class="container">
          <h3>Hey Admin!</h3>
          <p><span class="name">${name}</span> 
            has placed an order</p>
          <p>Here is the highlight of the order: </p>
          <ul>
          <li> Total Products: ${totalProducts}</li>
          <li> Total Cost: $${amount}</li>
          </ul>
          <p>Check your admin <a href=${redirectDomain}>dashboard</a> for full details.</p>         
                 
        </div>
      </body>
  `;
};
