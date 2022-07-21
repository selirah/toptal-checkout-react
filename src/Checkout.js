import React, { useEffect, useState, Fragment } from 'react'
import styles from './Checkout.module.css'
import { LoadingIcon } from './Icons'
import { getProducts } from './dataService'

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const Product = (props) => {
  const { product, onAddItem, onRemoveItem } = props
  const { id, name, availableCount, price, orderedQuantity, total } = product
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button
          className={styles.actionButton}
          onClick={(e) => onAddItem(id)}
          disabled={availableCount === 0}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          disabled={orderedQuantity === 0}
          onClick={() => onRemoveItem(id)}
        >
          -
        </button>
      </td>
    </tr>
  )
}

const Checkout = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [discount, setDiscount] = useState(0)

  const total = products.length
    ? products.reduce((acc, data) => acc + parseFloat(data.total), 0)
    : 0

  const getProductData = async () => {
    try {
      setLoading(true)
      const response = await getProducts()
      if (response.length) {
        const products = []
        response.map((p) => {
          p.orderedQuantity = 0
          p.total = (0.0).toFixed(2)
          products.push(p)
          return products
        })
        setProducts(products)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      getProductData()
    }
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (parseFloat(total) > 1000) {
      let discount = total * 0.1
      setDiscount(discount)
    } else {
      setDiscount(0)
    }
  }, [total])

  const onAddItem = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (product.availableCount > 0) {
      product.orderedQuantity = product.orderedQuantity + 1
      product.total = (product.price * product.orderedQuantity).toFixed(2)
      product.availableCount = product.availableCount - 1
      let copied = products.slice()
      copied = copied.filter((p) => p.id !== productId)
      copied.splice(productId - 1, 0, product)
      setProducts(copied)
    }
  }

  const onRemoveItem = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (product.orderedQuantity > 0) {
      product.orderedQuantity = product.orderedQuantity - 1
      product.total = (product.price * product.orderedQuantity).toFixed(2)
      product.availableCount = product.availableCount + 1
      let copied = products.slice()
      copied = copied.filter((p) => p.id !== productId)
      copied.splice(productId - 1, 0, product)
      setProducts(copied)
    }
  }

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        <Fragment>
          {loading ? (
            <LoadingIcon />
          ) : products.length ? (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th># Available</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Products should be rendered here */}
                  {products.length &&
                    products.map((product, index) => {
                      return (
                        <Product
                          key={index}
                          product={product}
                          onAddItem={onAddItem}
                          onRemoveItem={onRemoveItem}
                        />
                      )
                    })}
                </tbody>
              </table>
              <h2>Order summary</h2>
              {
                parseFloat(discount) > 0 ? <p>Discount: $ {discount.toFixed(2)}</p> : null
              }
              <p>Total: $ {total > 1000 ? (total - discount).toFixed(2) : total.toFixed(2)}</p>
            </>
          ) : (
            <h2>{JSON.stringify(error)}</h2>
          )}
        </Fragment>
      </main>
    </div>
  )
}

export default Checkout
