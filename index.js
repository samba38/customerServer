const express= require("express")
const {open}= require('sqlite')
const sqlite3= require('sqlite3')
const path= require('path')
const { request } = require("http")
const cors = require("cors");
const app=express()
const PORT = process.env.PORT || 5000; 
app.use(express.json())
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://customer-react-ptzb.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);


const dbpath= path.join(__dirname, 'database.db')

let db=null;

const initalizeSqlDB=async ()=>{
  try {
    db= await open({
        filename:dbpath,
        driver:sqlite3.Database
    });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch(e){
     console.log(`DB Error: ${e.message}`)
     process.exit(1)
  }
}

initalizeSqlDB()

app.post('/api/customers', async (request, response) =>{
  const {first_name, last_name, phone_number}= request.body 
  const insertQuery=`
   INSERT INTO 
    customers (first_name, last_name, phone_number)
    Values (
     '${first_name}',
     '${last_name}',
     '${phone_number}'
    );
     
  `;
  const dbResponse = await db.run(insertQuery);
  const customerId = dbResponse.lastID;
  response.send({ customerId: customerId });
})

app.get('/api/customers', async (request, response) =>{
    let {
    page = 1,            
    limit = 10,          
    order_by = 'id',     
    order = 'ASC',       
    search_q = '',       
  } = request.query

  page = Number(page)
  limit = Number(limit)
  const offset = (page - 1) * limit

  const searchPattern = `%${search_q}%`
  const getCustomerQuery=`
   SELECT * FROM customers
    WHERE LOWER(first_name) LIKE LOWER('${searchPattern}')
     OR LOWER(last_name) LIKE LOWER('${searchPattern}')
     OR LOWER(phone_number) LIKE LOWER('${searchPattern}')
     ORDER BY ${order_by} ${order}
    LIMIT ${limit} OFFSET ${offset};
  `;
  const result= await db.all(getCustomerQuery)
  response.send(result)

})

app.get('/api/customers/:id', async (request, response) =>{
   const {id}= request.params
   const getCustomerQuery=`
    SELECT * FROM customers
     WHERE id='${id}';
   `;
   const result= await db.get(getCustomerQuery)
   response.send(result)
})

app.put('/api/customers/:id', async (request, response) =>{
    const {id}=request.params
    const {first_name, last_name, phone_number}=request.body
    const updateQuery=`
     UPDATE customers
      SET 
       first_name='${first_name}',
       last_name='${last_name}',
       phone_number='${phone_number}'
      WHERE id='${id}';
    `;
    await db.run(updateQuery)
    response.json({ message: "Customer updated successfully" });
})

app.delete('/api/customers/:id', async (request, response) =>{
  const {id}=request.params
  const deleteQuery=`
   DELETE FROM customers
    WHERE id='${id}';
  `;
  await db.run(deleteQuery)
  response.json({ message: "Customer deleted successfully" });
})

app.post('/api/customers/:id/addresses', async (request, response) =>{
   const {id}=request.params 
   const {address_details, city, state, pin_code}=request.body 
   const selectQuery=`SELECT * FROM customers WHERE id='${id}';`;
   const dbUser= await db.get(selectQuery)
   if (dbUser===undefined){
     response.status(400);
    response.send("Invalid User");
   } else{
    const insertQuery=`
     INSERT INTO addresses (customer_id,address_details, city, state, pin_code)
     VALUES (
      '${id}',
      '${address_details}',
      '${city}',
      '${state}',
      '${pin_code}'
     );
    `;
    await db.run(insertQuery)
    response.send('New Adress Added')
   }
})

app.get('/api/customers/:id/addresses', async (request, response) =>{
  const {id}=request.params
  const customerQuery=`SELECT * FROM customers WHERE id='${id}';`;
  const dbUser= await db.get(customerQuery)
  if (dbUser!==undefined){
    const selectQuery=`
     SELECT id, address_details, city, state, pin_code
    FROM addresses
     WHERE customer_id ='${id}';
    `;
    const result= await db.all(selectQuery)
    response.send(result)
  } else{
    response.status(404).send({ error: 'Customer not found' })
  }
})

app.put('/api/addresses/:addressId', async (request, response) =>{
  const {addressId}=request.params
  const {address_details, city, state, pin_code}=request.body 
  const selectQuery=`SELECT * FROM addresses WHERE id='${addressId}';`;
  const dbUser= await db.get(selectQuery)
  if (dbUser!==undefined){
    const updateQuery=`
     UPDATE addresses
     SET 
      address_details='${address_details}',
      city='${city}',
      state='${state}',
      pin_code='${pin_code}'
     WHERE id='${addressId}';
    `;
    await db.run(updateQuery)
    response.send('Address updated successfully')
  } else{
    response.status(404).send({ error: 'Address not found' })
  }
})

app.delete('/api/addresses/:addressId', async (request, response) =>{
  const {addressId}= request.params 
  const selectQuery=`SELECT * FROM addresses WHERE id='${addressId}';`;
  const dbUser= await db.get(selectQuery)
  if (dbUser!==undefined){
    const deleteQuery=`
     DELETE FROM addresses WHERE id='${addressId}';
    `;
    await db.run(deleteQuery)
    response.send('Address deleted successfully')
  } else{
    response.status(404).send({ error: 'Address not found' })
  }
})