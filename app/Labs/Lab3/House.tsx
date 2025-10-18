export default function House() {
  const house = {
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2000,
    address: {
      street: "123 Main St",
      city: "Seattle",
      state: "WA",
      zip: "98101"
    },
    owners: ["Alice", "Bob"],
    amenities: {
      garage: true,
      pool: false,
      fireplace: true
    }
  };
  
  console.log(house);
  
  return (
    <div id="wd-house">
      <h2>House</h2>
      <h3>House Object</h3>
      <pre>{JSON.stringify(house, null, 2)}</pre>
      
      <h3>House Details</h3>
      <p>Bedrooms: {house.bedrooms}</p>
      <p>Bathrooms: {house.bathrooms}</p>
      <p>Square Feet: {house.squareFeet}</p>
      
      <h3>Address</h3>
      <p>
        {house.address.street}, {house.address.city}, {house.address.state} {house.address.zip}
      </p>
      
      <h3>Owners</h3>
      <ul>
        {house.owners.map((owner, index) => (
          <li key={index}>{owner}</li>
        ))}
      </ul>
      
      <h3>Amenities</h3>
      <ul>
        <li>Garage: {house.amenities.garage ? "Yes" : "No"}</li>
        <li>Pool: {house.amenities.pool ? "Yes" : "No"}</li>
        <li>Fireplace: {house.amenities.fireplace ? "Yes" : "No"}</li>
      </ul>
      <hr />
    </div>
  );
}