import { Button, CssBaseline, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactImageMagnify from 'react-image-magnify';
import api from '../../api';
import HeightBox from '../../components/HeightBox';
import NavBar from '../../components/NavBar';
import { addToCart } from '../../reducers/modules/cart';
import './styles.css';

export default function ProductPage(props) {
  const [product, setProduct] = useState();
  const dispatch = useDispatch();
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState();
  const [selectedVariant, setSelectedVarinat] = useState();
  const [selectedImage, setSelectedImage] = useState('');
  const location = useLocation();
  const params = location.pathname.split('/');
  const productId = params[params.length - 1];

  async function getAllVariants() {
    try {
      const [code, res] = await api.variant.getVariantsForProduct(productId);
      if (res?.statusCode === 200) {
        if (res?.data?.variants.length) {
          setSelectedVariantId(res?.data?.variants[0]?.variant_id);
          setSelectedVarinat(res?.data?.variants[0]);
        }
        setVariants(res?.data?.variants);
      }
    } catch (error) {}
  }

  async function getProduct() {
    try {
      const [code, res] = await api.product.getProduct(productId);
      if (res?.statusCode === 200) {
        console.log(res?.data?.product);
        setProduct(res?.data?.product);
        if (res?.data?.product?.images.length) {
          setSelectedImage(res?.data?.product?.images[0].image);
        }
      }
    } catch (error) {}
  }

  function addProductToCart() {
    const item = {
      unitPrice: selectedVariant?.unit_price,
      productId,
      variantId: selectedVariant?.variant_id,
      mainImage: selectedImage,
      items: 1,
      title: product?.title,
      quantityInStock: selectedVariant?.quantity_in_stock,
    };
    dispatch(addToCart(item));
  }

  React.useEffect(() => {
    getProduct();
    getAllVariants();
  }, [productId]);

  React.useEffect(() => {
    if (selectedVariantId) {
      const item = variants.find(
        (item) => item?.variant_id === selectedVariantId
      );
      setSelectedVarinat(item);
    } else {
      setSelectedVarinat(null);
    }
  }, [selectedVariantId]);

  return (
    <div>
      <CssBaseline />
      <NavBar />
      <HeightBox height={50} />
      <div style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
        <Stack direction="row" spacing={10}>
          <div>
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: 'Wristwatch by Ted Baker London',
                  isFluidWidth: true,
                  src: selectedImage,
                  sizes:
                    '(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px',
                },
                largeImage: {
                  src: selectedImage,
                  width: 1000,
                  height: 1000,
                },
              }}
            />
            {/* <div
              style={{
                width: 500,
                height: 500,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <img src={selectedImage} alt="" style={{ width: 500 }} />
            </div> */}

            <HeightBox height={10} />
            <div
              style={{
                width: 500,
                overflowX: 'scroll',
                display: 'flex',
                flexDirection: 'row',
              }}
              className="image-container"
            >
              {product?.images.map((item) => (
                <div>
                  <img
                    src={item?.image}
                    alt=""
                    style={{ height: 150, marginLeft: 10, cursor: 'pointer' }}
                    onClick={() => setSelectedImage(item?.image)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Typography variant="h4" fontWeight="bold">
              {product?.title}
            </Typography>
            <HeightBox height={20} />
            <Typography color="text.secondary" variant="h6">
              Select Variant
            </Typography>
            <HeightBox height={20} />
            {selectedVariant && (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Variant</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={selectedVariant}
                  value={selectedVariantId}
                  fullWidth
                  label="Variant"
                  onChange={(event) => {
                    setSelectedVariantId(event.target.value);
                  }}
                >
                  {variants.map((item) => (
                    <MenuItem value={item?.variant_id}>
                      {item?.variant_type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <HeightBox height={10} />
            {selectedVariant && (
              <Typography
                variant="p"
                color={selectedVariant?.quantity_in_stock ? 'green' : 'red'}
              >
                {selectedVariant?.quantity_in_stock + ' in stock'}
              </Typography>
            )}
            <HeightBox height={20} />
            {selectedVariant && (
              <Typography
                variant="p"
                color="#3AB4F2"
                fontSize={20}
                fontWeight="bold"
              >
                {'$' + selectedVariant?.unit_price}
              </Typography>
            )}
            <HeightBox height={20} />
            {selectedVariant && (
              <Typography variant="h6" color="text.secondary" fontWeight="bold">
                Description
              </Typography>
            )}
            <HeightBox height={10} />
            <Typography variant="p">{selectedVariant?.description}</Typography>
            <HeightBox height={20} />
            {selectedVariant && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={addProductToCart}
                startIcon={<AiOutlineShoppingCart />}
              >
                Add to Cart
              </Button>
            )}
            <HeightBox height={20} />
          </div>
        </Stack>
      </div>
    </div>
  );
}
