import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams, Navigate } from 'react-router-dom';

import './singleCart.css';
import '../home/home.css';

const SingleCart = () => {
    const { cartId } = useParams();
    const [singleCartDetails, setSingleCartDetails] = useState({});
    const [productList, setProductList] = useState([]);
    const [confirmSave, setConfirmSave] = useState(false);

    useEffect(() => {
        getSingleCartDetails();
    }, [cartId])

    const getSingleCartDetails = () => {
        axios.get(`https://fakestoreapi.com/carts/${cartId}`).then(function (response) {
            setSingleCartDetails({ ...response.data });
            getProductList(response.data.products)
        }).catch(function (error) {
            console.error(error);
        });
    }

    const getProductList = (product) => {
        if (product.length > 0) {
            Promise.all(
                product.map(element => {
                    return axios.get(`https://fakestoreapi.com/products/${element.productId}`).then(function (response) {
                        return { ...response.data, productQuantity: element.quantity };
                    }).catch(function (error) {
                        console.error(error);
                    });
                })
            ).then(result => {
                setProductList([...result]);
            })
        }
    }

    const deleteProduct = (id) => {
        let a = window.confirm('Please confirm you would like to remove product for this cart?');
        if (a === true) {
            let ind = singleCartDetails.products.findIndex(x => x.productId.toString() === id.toString());
            if (ind !== -1) {
                const singleCartData = { ...singleCartDetails }
                singleCartData.products.splice(ind, 1);
                setSingleCartDetails({ ...singleCartData });
                let removeFromProduct = productList.findIndex(x => x.id.toString() === id.toString());
                if (removeFromProduct !== -1) {
                    const productArr = [...productList];
                    productArr.splice(removeFromProduct, 1);
                    setProductList([...productArr]);
                }
            }
        }
    }

    const updateSingleCart = (data) => {
        // fetch(`https://fakestoreapi.com/carts/${cartId}`,{
        //     method:"PUT",
        //     body:JSON.stringify(data)
        // })
        //     .then(res=>res.json())
        //     .then(json=>console.log(json))
        axios.put(`https://fakestoreapi.com/carts/${cartId}`, JSON.stringify(data)).then(function (response) {
            getSingleCartDetails();
        }).catch(function (error) {
            console.error(error);
        });
    }

    const cartConfirm = () => {
        let a = window.confirm('Please confirm you would like to save this changes in cart?');
        if (a === true) {
            updateSingleCart(singleCartDetails);
            setConfirmSave(true)
        }
    }

    const decreaseQuantity = (id) => {
        let removeFromProduct = productList.findIndex(x => x.id.toString() === id.toString());
        if (removeFromProduct !== -1) {
            const productArr = [...productList];
            productArr[removeFromProduct]['productQuantity'] = productArr[removeFromProduct]['productQuantity'] - 1;
            setProductList([...productArr]);
        }
    }
    
    const increaseQuantity = (id) => {
        let removeFromProduct = productList.findIndex(x => x.id.toString() === id.toString());
        if (removeFromProduct !== -1) {
            const productArr = [...productList];
            productArr[removeFromProduct]['productQuantity'] = productArr[removeFromProduct]['productQuantity'] + 1;
            setProductList([...productArr]);
        }
    }

    if (confirmSave) {
        return <Navigate to="/" />
    }

    return (
        <div className="singleCartWrapper">
            <h3>{`Cart ${singleCartDetails.id}`}</h3>
            <div>{moment(singleCartDetails.date).format('DD/MM/YYYY hh:mm:ss')}</div>
            {productList && productList.map((pro, i) => (
                <div className="single-product-wrapper product-flex" key={i}>
                    <div className="product-image margin-right">
                        <img src={pro.image} alt="ProductImage" height="250" width="200" />
                    </div>
                    <div className="product-details">
                       <div className="product-title">{`${pro.title} - ${pro.category}`}</div>
                        <h2>&#8377;{pro.price}</h2>
                        <div className="item-count-flex">
                            {pro.productQuantity > 1 && <div className="counter-btn" onClick={() => decreaseQuantity(pro.id)}>-</div>}
                            <h4>{pro.productQuantity}</h4>
                            <div className="counter-btn" onClick={() => increaseQuantity(pro.id)}>+</div>
                        </div>
                        <div>{pro.description}</div>
                        <button onClick={() => deleteProduct(pro.id)}>Delete</button>
                    </div>
                </div>
            ))}
            <div className="confirm-btn-portion">
                <button className="confirm-btn" onClick={cartConfirm}>Confirm</button>
            </div>
        </div>
    )
}

export default SingleCart;