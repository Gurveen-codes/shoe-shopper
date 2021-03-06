import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, ListGroup, Card, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import {
	getOrderDetails,
	payOrder,
	deliverOrder,
	tempPayOrder,
} from "../actions/orderActions";
import {
	ORDER_PAY_RESET,
	ORDER_TEMP_PAY_RESET,
	ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const OrderScreen = ({ match, history }) => {
	// Get orderID from route params
	const orderId = match.params.id;

	const [sdkReady, setSdkReady] = useState(false);

	const dispatch = useDispatch();

	// User login chunk of state to check for admin status
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	// Order details chunk of state
	const orderDetails = useSelector((state) => state.orderDetails);
	const { order, loading, error } = orderDetails;

	// Order pay chunk of state
	const orderPay = useSelector((state) => state.orderPay);
	const { loading: loadingPay, success: successPay } = orderPay;

	// Order deliver chunk of state
	const orderDeliver = useSelector((state) => state.orderDeliver);
	const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

	// Temp Order pay chunk of state
	const tempOrderPay = useSelector((state) => state.tempOrderPay);
	const { success: successTempPay } = tempOrderPay;

	// Method to add decimals to given input
	const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

	if (!loading) {
		// Calculate Prices
		order.itemsPrice = addDecimals(
			order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
		);

		order.shippingPrice = addDecimals(order.itemsPrice > 500 ? 0 : 25);

		order.totalPrice = (
			Number(order.itemsPrice) + Number(order.shippingPrice)
		).toFixed(2);
	}

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		}

		//* Dynamically add script for payPal sdk
		const addPaypalScript = async () => {
			const { data: clientId } = await axios.get("/api/paypal/config");

			const script = document.createElement("script");
			script.type = "text/javascript";
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`;
			script.async = true;
			script.onload = () => {
				setSdkReady(true);
			};

			document.body.appendChild(script);
		};

		if (
			!order ||
			order._id !== orderId ||
			successPay ||
			successDeliver ||
			successTempPay
		) {
			dispatch({ type: ORDER_PAY_RESET });
			dispatch({ type: ORDER_TEMP_PAY_RESET });
			dispatch({ type: ORDER_DELIVER_RESET });

			dispatch(getOrderDetails(orderId));
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPaypalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [
		history,
		userInfo,
		order,
		orderId,
		dispatch,
		successPay,
		successDeliver,
		successTempPay,
	]);

	// Payment Success Handler
	const paymentSuccessHandler = (paymentResult) => {
		dispatch(payOrder(orderId, paymentResult));
	};

	// Temp Payment Success Handler
	const tempPaymentHandler = () => {
		dispatch(tempPayOrder(orderId));
	};

	// Deliver Handler
	const deliverHandler = () => {
		dispatch(deliverOrder(order));
	};

	//* return statement/////////////////////////
	return loading ? (
		<Loader></Loader>
	) : error ? (
		<Message variant="danger">{error}</Message>
	) : (
		<>
			<Meta title={`Order ${order._id}`} />
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong>
								{order.user.name}
							</p>
							<p>
								<strong>Email: </strong>
								{order.user.email}
							</p>
							<p>
								<strong>Address: </strong>
								{order.shippingAddress.address}, {order.shippingAddress.city},{" "}
								{order.shippingAddress.postalCode}
							</p>
							{order.isDelivered ? (
								<Message variant="success">{`Delivered at ${order.deliveredAt.substring(
									0,
									10
								)}`}</Message>
							) : (
								<Message variant="secondary">Not Delivered</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant="success">{`Paid at ${order.paidAt.substring(
									0,
									10
								)}`}</Message>
							) : (
								<Message variant="secondary">Not Paid</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Cart Items: </h2>
							{order.orderItems.length === 0 ? (
								<Message>Your cart is empty</Message>
							) : (
								<ListGroup variant="flush">
									{order.orderItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={2}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													></Image>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x {item.price} = Rs.{" "}
													{addDecimals(item.qty * item.price)}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>

				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>Rs. {order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>Rs. {order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>Rs. {order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader></Loader>}
									{!sdkReady ? (
										<Loader></Loader>
									) : (
										<PayPalButton
											currency="INR"
											amount={order.totalPrice}
											onSuccess={paymentSuccessHandler}
										></PayPalButton>
									)}
								</ListGroup.Item>
							)}

							{loadingDeliver && <Loader />}
							{/* Temp Payment Button */}
							{userInfo && userInfo.isAdmin && !order.isPaid && (
								<ListGroup.Item>
									<Button
										type="button"
										className="btn btn-block btn-warning"
										onClick={tempPaymentHandler}
									>
										Mark as Paid
									</Button>
								</ListGroup.Item>
							)}
							{userInfo &&
								userInfo.isAdmin &&
								order.isPaid &&
								!order.isDelivered && (
									<ListGroup.Item>
										<Button
											type="button"
											className="btn btn-block"
											onClick={deliverHandler}
										>
											Mark as Delivered
										</Button>
									</ListGroup.Item>
								)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrderScreen;
