import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { listDetailProduct } from "../../actions/productActions";

const ProductEditScreen = ({ match, history }) => {
	const productId = match.params.id;

	const [name, setName] = useState("");
	const [price, setPrice] = useState(0);
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [brand, setBrand] = useState("");
	const [countInStock, setCountInStock] = useState(0);
	const [image, setImage] = useState("");

	const dispatch = useDispatch();

	const productDetail = useSelector((state) => state.productDetail);
	const { loading, error, product } = productDetail;

	useEffect(() => {
		if (!product.name || product._id !== productId) {
			dispatch(listDetailProduct(productId));
		} else {
			setName(product.name);
			setPrice(product.price);
			setDescription(product.description);
			setCategory(product.category);
			setBrand(product.brand);
			setCountInStock(product.countInStock);
			setImage(product.image);
		}
	}, [dispatch, history, productId, product]);

	//* Product update handler
	const submitHandler = (e) => {
		e.preventDefault();
		//TODO: Update Product
	};

	return (
		<>
			<Link to="/admin/productlist" className="btn btn-dark my-2">
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Product</h1>

				{error && <Message variant="danger">{error}</Message>}
				{loading && <Loader></Loader>}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId="name">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter Name"
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="price">
						<Form.Label>Price</Form.Label>
						<Form.Control
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder="Enter price"
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="image">
						<Form.Label>Product Image</Form.Label>
						<Form.Control
							type="text"
							value={image}
							onChange={(e) => setImage(e.target.value)}
							placeholder="Enter image url"
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="brand">
						<Form.Label>Brand</Form.Label>
						<Form.Control
							type="text"
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
							placeholder="Enter brand"
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="category">
						<Form.Label>Category</Form.Label>
						<Form.Control
							type="text"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							placeholder="Enter category"
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="countInStock">
						<Form.Label>Count In Stock</Form.Label>
						<Form.Control
							type="number"
							value={countInStock}
							onChange={(e) => setCountInStock(e.target.value)}
							placeholder="Enter count in stock"
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="description">
						<Form.Label>Description</Form.Label>
						<Form.Control
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Enter description"
						></Form.Control>
					</Form.Group>

					<Button type="submit" variant="primary">
						Update
					</Button>
				</Form>
			</FormContainer>
		</>
	);
};

export default ProductEditScreen;
