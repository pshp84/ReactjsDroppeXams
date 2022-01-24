import React, { useEffect, useState } from 'react';
import axios from "axios";
import moment from 'moment';
import { Link } from 'react-router-dom';

import './home.css';

const HomeWrapper = () => {
    const [cartList, setCartList] = useState([]);

    useEffect(() => {
        getCartData();
    }, [])

    const getCartData = () => {
        axios.get('https://fakestoreapi.com/carts').then(function (response) {
            setCartList([...response.data]);
        }).catch(function (error) {
            console.error(error);
        });
    }

    const cartConfirm = () => {
        window.confirm('Please confirm you would add same gift amount in every cart?');
        
    }

    return (
        <div className="cart-list-wrapper">
            <div className="confirm-btn-portion">
                <button className="confirm-btn" onClick={cartConfirm}>Confirm</button>
            </div>
            {cartList.length > 0 && cartList.map((cart, i) => (
                <Link to={`/singleCart/${cart.id}`} key={i}>
                    <div className="single-cart-wrapper" key={i}>
                        <div className="flex-item">
                            <div className="cart-title">{`Cart ${cart.id}`}</div>
                            <div className="cart-date">{moment(cart.date).format('DD/MM/YYYY hh:mm:ss')}</div>
                        </div>
                        <div className="cart-body">
                            {cart.products.map((pro, i) => (
                                <div className="product-flex" key={i}>
                                    <div className="margin-right"><span className="product-key">Product name :</span><span className="product-value">{`  Product ${pro.productId}`}</span></div>
                                    <div><span className="product-key">Product quantity :</span><span className="product-value">{`  ${pro.quantity}`}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default HomeWrapper;