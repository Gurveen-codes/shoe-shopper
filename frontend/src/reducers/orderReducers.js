import * as actionTypes from "../constants/orderConstants";

const orderCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case actionTypes.ORDER_CREATE_REQUEST:
			return { loading: true };
		case actionTypes.ORDER_CREATE_SUCCESS:
			return {
				loading: false,
				success: true,
				order: action.payload,
			};
		case actionTypes.ORDER_CREATE_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

//**************************************/

const orderDetailsReducer = (
	state = { loading: true, orderItems: [], shippingAddress: {} },
	action
) => {
	switch (action.type) {
		case actionTypes.ORDER_DETAILS_REQUEST:
			return { ...state, loading: true };
		case actionTypes.ORDER_DETAILS_SUCCESS:
			return {
				loading: false,
				success: true,
				order: action.payload,
			};
		case actionTypes.ORDER_DETAILS_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

const orderPayReducer = (state = {}, action) => {
	switch (action.type) {
		case actionTypes.ORDER_PAY_REQUEST:
			return { loading: true };
		case actionTypes.ORDER_PAY_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case actionTypes.ORDER_PAY_FAIL:
			return {
				loading: false,
				error: action.payload,
			};
		case actionTypes.ORDER_PAY_RESET:
			return {};
		default:
			return state;
	}
};

const tempOrderPayReducer = (state = {}, action) => {
	switch (action.type) {
		case actionTypes.ORDER_TEMP_PAY_REQUEST:
			return { loading: true };
		case actionTypes.ORDER_TEMP_PAY_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case actionTypes.ORDER_TEMP_PAY_FAIL:
			return {
				loading: false,
				error: action.payload,
			};
		case actionTypes.ORDER_TEMP_PAY_RESET:
			return {};
		default:
			return state;
	}
};

const orderDeliverReducer = (state = {}, action) => {
	switch (action.type) {
		case actionTypes.ORDER_DELIVER_REQUEST:
			return { loading: true };
		case actionTypes.ORDER_DELIVER_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case actionTypes.ORDER_DELIVER_FAIL:
			return {
				loading: false,
				error: action.payload,
			};
		case actionTypes.ORDER_DELIVER_RESET:
			return {};
		default:
			return state;
	}
};

const myOrdersListReducer = (state = { orders: [] }, action) => {
	switch (action.type) {
		case actionTypes.MY_ORDER_LIST_REQUEST:
			return { loading: true };
		case actionTypes.MY_ORDER_LIST_SUCCESS:
			return {
				loading: false,
				orders: action.payload,
			};
		case actionTypes.MY_ORDER_LIST_FAIL:
			return {
				loading: false,
				error: action.payload,
			};
		case actionTypes.MY_ORDER_LIST_RESET:
			return {
				orders: [],
			};

		default:
			return state;
	}
};

const orderListReducer = (state = { orders: [] }, action) => {
	switch (action.type) {
		case actionTypes.ORDER_LIST_REQUEST:
			return { loading: true };
		case actionTypes.ORDER_LIST_SUCCESS:
			return {
				loading: false,
				orders: action.payload,
			};
		case actionTypes.ORDER_LIST_FAIL:
			return {
				loading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};

export {
	orderCreateReducer,
	orderDetailsReducer,
	orderPayReducer,
	myOrdersListReducer,
	orderListReducer,
	orderDeliverReducer,
	tempOrderPayReducer,
};
