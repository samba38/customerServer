const {open}= require('sqlite')
const sqlite3= require('sqlite3')

const initalizeSqlDB=async ()=>{
  const db=open({
    filename:"database.db",
    driver:sqlite3.Database
  })
  return db
}

const tableCreate=async ()=>{
 const db= await initalizeSqlDB()
 const tableQuery=`
  CREATE TABLE IF NOT EXISTS customers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name  TEXT NOT NULL,
    phone_number TEXT NOT NULL
  );
  
 `;
 await db.run(tableQuery)
 console.log('Table created')
}

const tableCreate2=async ()=>{
    const db= await initalizeSqlDB()
    const tableQuery=`
     CREATE TABLE IF NOT EXISTS addresses(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      address_details TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
     );
    `;
    await db.run(tableQuery)
    console.log('adress table created')
}


const insertCustomers=async ()=>{
 const db= await initalizeSqlDB()
 const insertQuery=`
  INSERT  INTO customers (first_name, last_name, phone_number)
   VALUES (?, ?, ?)
 `;
   const customers = [
    ['John', 'Doe', '9876543210'],
    ['Priya', 'Sharma', '9876501234'],
    ['Arjun', 'Reddy', '9001234567'],
    ['Sneha', 'Patel', '9123456789'],
    ['Michael', 'Smith', '9988776655'],
    ['Aarav', 'Kapoor', '9811122233'],
    ['Riya', 'Nair', '9822334455'],
    ['David', 'Johnson', '9833445566'],
    ['Ananya', 'Iyer', '9844556677'],
    ['Karan', 'Malhotra', '9855667788'],
    ['Emily', 'Davis', '9866778899'],
    ['Aditya', 'Mishra', '9877889900'],
    ['Sofia', 'Williams', '9888990011'],
    ['Rahul', 'Verma', '9899001122'],
    ['Ishita', 'Mehta', '9900112233'],
    ['James', 'Brown', '9911223344'],
    ['Ayesha', 'Khan', '9922334455'],
    ['Vikram', 'Singh', '9933445566'],
    ['Olivia', 'Taylor', '9944556677'],
    ['Nikhil', 'Chopra', '9955667788'],
    ['Sarah', 'Wilson', '9966778899'],
    ['Kabir', 'Gupta', '9977889900'],
    ['Meera', 'Rao', '9988990011'],
    ['Chris', 'Anderson', '9999001122'],
    ['Tanya', 'Bansal', '9001122334']
  ]
  for(let customer of customers){
    await db.run(insertQuery, customer)
  }
  console.log('25 customers created')
}

const insertAdress=async ()=>{
 const db= await initalizeSqlDB()
 const insertQuery=`
  INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
   VALUES (?, ?, ?, ?, ?)
 `;
 const addresses = [
  [1, '123 Main Street', 'Hyderabad', 'Telangana', '500001'],
  [1, 'Flat 45, Green Towers', 'Hyderabad', 'Telangana', '500032'],

  [2, '56 MG Road', 'Bengaluru', 'Karnataka', '560001'],

  [3, 'Plot 88, Jubilee Hills', 'Hyderabad', 'Telangana', '500033'],
  [3, 'Lake View Residency', 'Chennai', 'Tamil Nadu', '600041'],

  [4, '22 Sector 17', 'Ahmedabad', 'Gujarat', '380015'],

  [5, 'Palm Grove Apartments', 'Mumbai', 'Maharashtra', '400076'],

  [6, 'Infinity Towers', 'Delhi', 'Delhi', '110001'],

  [7, 'Garden View Society', 'Kochi', 'Kerala', '682001'],
  [7, 'Ocean Breeze Residency', 'Trivandrum', 'Kerala', '695001'],

  [8, 'Sunshine Apartments', 'Pune', 'Maharashtra', '411001'],

  [9, 'Lotus Residency', 'Chennai', 'Tamil Nadu', '600032'],

  [10, 'Pearl Heights', 'Jaipur', 'Rajasthan', '302001'],
  [10, 'Metro Plaza', 'Jaipur', 'Rajasthan', '302004'],

  [11, 'Skyline Apartments', 'Kolkata', 'West Bengal', '700001'],

  [12, 'Harmony Villas', 'Lucknow', 'Uttar Pradesh', '226001'],

  [13, 'Silver Oak Residency', 'Chandigarh', 'Chandigarh', '160017'],

  [14, 'Heritage Homes', 'Bhopal', 'Madhya Pradesh', '462001'],
  [14, 'Central Park Residency', 'Indore', 'Madhya Pradesh', '452001'],

  [15, 'Rose Garden Apartments', 'Amritsar', 'Punjab', '143001'],

  [16, 'Crystal Plaza', 'Nagpur', 'Maharashtra', '440001'],

  [17, 'Royal Residency', 'Varanasi', 'Uttar Pradesh', '221001'],

  [18, 'Springfield Apartments', 'Delhi', 'Delhi', '110020'],

  [19, 'Meadow View', 'Patna', 'Bihar', '800001'],

  [20, 'Green Valley Residency', 'Chennai', 'Tamil Nadu', '600020'],
  [20, 'Palm Residency', 'Madurai', 'Tamil Nadu', '625001'],

  [21, 'Sunset Towers', 'Hyderabad', 'Telangana', '500081'],

  [22, 'City Center Residency', 'Gurgaon', 'Haryana', '122001'],

  [23, 'Hilltop Apartments', 'Shimla', 'Himachal Pradesh', '171001'],

  [24, 'Galaxy Residency', 'Noida', 'Uttar Pradesh', '201301'],

  [25, 'Blue Diamond Residency', 'Goa', 'Goa', '403001'],
  [25, 'Seaside Villas', 'Goa', 'Goa', '403002']
]
 for(let adres of addresses){
    await db.run(insertQuery, adres)
 }
 console.log('adress inserted')
}

insertAdress()