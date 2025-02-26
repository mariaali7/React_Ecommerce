import "./Productsimilar.css";
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Chip,
  Rating,
  ButtonGroup,
  Skeleton,
  IconButton,
} from "@mui/material";
import { MdAddShoppingCart } from "react-icons/md";
import {
  AiFillHeart,
  AiFillCloseCircle,
  AiOutlineLogin,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { TbDiscount2 } from "react-icons/tb";
import axios from "axios";
import { toast } from "react-toastify";
import { ContextFunction } from "../../Context/Context";
import ProductReview from "../../Components/Review/ProductReview";
import ProductCard from "../../Components/Card/Product Card/ProductCard";
import { Transition, getSingleProduct } from "../../Constants/Constant";
import CopyRight from "../../Components/CopyRight/CopyRight";

const ProductDetail = () => {
  const { cart, setCart, wishlistData, setWishlistData } =
    useContext(ContextFunction);
  const [openAlert, setOpenAlert] = useState(false);
  const { id, name } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProduct, setSimilarProduct] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;

  useEffect(() => {
    getSingleProduct(setProduct, id, setLoading);
    getSimilarProducts();
    window.scroll(0, 0);
  }, [id]);
  const addToCart = async (product) => {
    if (setProceed) {
      try {
        let reqData = {
          userId: authToken,
          productId: product.id,
          quantity: productQuantity,
        };
        const { data } = await axios.post(
          `http://localhost:8000/src/Apis/cart/addToCart.php`,
          reqData
        );

        setCart(data);
        setCart([...cart, product]);
        toast.success("Added To Cart", { autoClose: 500, theme: "colored" });
      } catch (error) {
        toast.error(error.response.data.msg, {
          autoClose: 500,
          theme: "colored",
        });
      }
    } else {
      setOpenAlert(true);
    }
  };
  const addToWhishList = async (product) => {
    if (setProceed) {
      try {
        const { data } = await axios.post(
          `http://localhost:8000/src/Apis/wishList/addToWishList.php`,
          { _id: product._id },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setWishlistData(data);
        setWishlistData([...wishlistData, product]);
        toast.success("Added To Wishlist", {
          autoClose: 500,
          theme: "colored",
        });
      } catch (error) {
        toast.error(error.response.data.msg, {
          autoClose: 500,
          theme: "colored",
        });
      }
    } else {
      setOpenAlert(true);
    }
  };
  const shareProduct = (product) => {
    const data = {
      text: product.name,
      title: "e-shopit",
      url: `http://localhost:3000/Detail/${name}/${id}`,
    };
    if (navigator.canShare && navigator.canShare(data)) {
      navigator.share(data);
    } else {
      toast.error("browser not support", { autoClose: 500, theme: "colored" });
    }
  };
  const getSimilarProducts = async () => {
    const { data } = await axios.post(
      `http://localhost:8000/src/apis/users/GetCategoryProducts.php`,
      name
    );
    setSimilarProduct(data);
  };

  const increaseQuantity = () => {
    setProductQuantity((prev) => prev + 1);
    if (productQuantity >= 5) {
      setProductQuantity(5);
    }
  };
  const decreaseQuantity = () => {  
    setProductQuantity((prev) => prev - 1);
    if (productQuantity <= 1) {
      setProductQuantity(1);
    }
  };
  return (
    <>
      <Container maxWidth="xl">
        <Dialog
          open={openAlert}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpenAlert(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
            <DialogContentText
              style={{ textAlign: "center" }}
              id="alert-dialog-slide-description"
            >
              Please Login To Proceed
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Link to="/login">
              {" "}
              <Button
                variant="contained"
                endIcon={<AiOutlineLogin />}
                color="primary"
              >
                Login
              </Button>
            </Link>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenAlert(false)}
              endIcon={<AiFillCloseCircle />}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <main className="main-content">
          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <div className="product-image">
              <div className="detail-img-box">
                <img
                  alt={product.name}
                  src={product.mainPicture}
                  className="detail-img"
                />
                <br />
              </div>
            </div>
          )}
          {loading ? (
            <section
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Skeleton variant="rectangular" height={200} width="200px" />
              <Skeleton variant="text" height={400} width={700} />
            </section>
          ) : (
            <section className="product-details">
              {console.log("Producto", product)}
              <Typography variant="h4">{product.name}</Typography>

              <Typography>{product.description}</Typography>

              <Chip
                label={
                  product.discount > 0
                    ? `Upto ${product.discount}% off`
                    : "Best Price"
                }
                variant="outlined"
                sx={{
                  background: "#1976d2",
                  color: "white",
                  width: "150px",
                  fontWeight: "bold",
                }}
                avatar={<TbDiscount2 color="white" />}
              />
              <div style={{ display: "flex", gap: 20 }}>
                <Typography variant="h6" color="red">
                  <s>
                    JD
                    {product.price + product.price * 0.2}
                  </s>
                </Typography>
                <Typography variant="h6" color="primary">
                  JD{product.price}
                </Typography>
              </div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  "& > *": {
                    m: 1,
                  },
                }}
              >
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  <Button onClick={increaseQuantity}>+</Button>
                  <Button>{productQuantity}</Button>
                  <Button onClick={decreaseQuantity}>-</Button>
                </ButtonGroup>
              </Box>
              <Rating
                name="read-only"
                value={Math.round(product.rating)}
                readOnly
                precision={0.5}
              />
              <div style={{ display: "flex" }}>
                <Tooltip title="Add To Cart">
                  <Button
                    variant="contained"
                    className="all-btn"
                    startIcon={<MdAddShoppingCart />}
                    onClick={() => addToCart(product)}
                  >
                    Buy
                  </Button>
                </Tooltip>
                <Tooltip title="Add To Wishlist">
                  <Button
                    style={{ marginLeft: 10 }}
                    size="small"
                    variant="contained"
                    className="all-btn"
                    onClick={() => addToWhishList(product)}
                  >
                    {<AiFillHeart fontSize={21} />}
                  </Button>
                </Tooltip>
                <Tooltip title="Share">
                  <Button
                    style={{ marginLeft: 10 }}
                    variant="contained"
                    className="all-btn"
                    startIcon={<AiOutlineShareAlt />}
                    onClick={() => shareProduct(product)}
                  >
                    Share
                  </Button>
                </Tooltip>
              </div>
            </section>
          )}
        </main>
        <ProductReview
          setProceed={setProceed}
          authToken={authToken}
          id={id}
          setOpenAlert={setOpenAlert}
        />

        <Typography
          sx={{
            marginTop: 10,
            marginBottom: 5,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Similar Products
        </Typography>
        <Box>
          <Box
            className="similarProduct"
            sx={{ display: "flex", overflowX: "auto", marginBottom: 10 }}
          >
            {similarProduct
              .filter((prod) => prod._id !== id)
              .map((prod) => (
                <Link
                  to={`/Detail/type/${prod.type}/${prod._id}`}
                  key={prod._id}
                >
                  <ProductCard prod={prod} />
                </Link>
              ))}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ProductDetail;
