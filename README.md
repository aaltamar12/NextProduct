## Getting Started

First, install al dependencies:
```bash
npm install
```

Now you can run the development server:
> **Note: **Not forget to complete the .env file; you can use the base file .env.example.
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see Create Product Page.

To see Product Details, you only need to add /product/{product_id} to the url

If you want to see all  the products, go to [http://localhost:3000/product/{product_id}](http://localhost:3000/product/{product_id})


**Example:**
```
http://localhost:3000/product/596ea55f-23de-4450-b177-b7a74a2897b3
```
> **Note: **Product id is an ID assigned by the backend on Rails.The ID is type UUID.

**Urls:**
* http://localhost:3000/ - Create Product / Root
* http://localhost:3000/product/ - All Products
* http://localhost:3000/product/{product_id} -  Selected Product