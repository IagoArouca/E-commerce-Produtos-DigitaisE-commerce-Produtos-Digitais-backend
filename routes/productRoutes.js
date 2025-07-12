const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer'); 
const cloudinary = require('cloudinary').v2; 
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
  }
});
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos do DB:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar produtos.' });
  }
});
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body; 
  
    if (!req.file) {
      return res.status(400).json({ message: 'Por favor, faça upload de uma imagem para o produto.' });
    }
    if (!name || !price) {
      return res.status(400).json({ message: 'Por favor, forneça nome e preço para o produto.' });
    }
    const cloudinaryUploadResult = await cloudinary.uploader.upload_stream(
      {
        folder: 'ecommerce-products',
        resource_type: 'auto',   
      },
      async (error, result) => {
        if (error) {
          console.error('Erro no upload para Cloudinary:', error);
          return res.status(500).json({ message: 'Erro ao fazer upload da imagem.', error: error.message });
        }

        const imageUrl = result.secure_url; 
        const newProduct = new Product({
          name,
          price,
          imageUrl, 
          description 
        });

        try {
          await newProduct.save();
          res.status(201).json(newProduct);
        } catch (dbError) {
          console.error('Erro ao salvar produto no DB após upload:', dbError);
          res.status(400).json({ message: 'Erro ao adicionar produto no banco de dados.', error: dbError.message });
        }
      }
    ).end(req.file.buffer); 
    
  } catch (error) {
    console.error('Erro geral na rota POST /products:', error);
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produto não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body; 
    let imageUrl; 
    if (req.file) {
      const cloudinaryUploadResult = await cloudinary.uploader.upload_stream(
        {
          folder: 'ecommerce-products',
          resource_type: 'auto',
        },
        async (error, result) => {
          if (error) {
            console.error('Erro no upload de atualização para Cloudinary:', error);
            return res.status(500).json({ message: 'Erro ao fazer upload da nova imagem.', error: error.message });
          }
          imageUrl = result.secure_url; 
          await updateProductInDb(id, { name, price, description, imageUrl }, res);
        }
      ).end(req.file.buffer);
    } else {
      await updateProductInDb(id, { name, price, description }, res);
    }

  } catch (error) {
    console.error('Erro geral na rota PUT /products/:id:', error);
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
});
async function updateProductInDb(id, updates, res) {
  try {
    const product = await Product.findById(id);

    if (product) {
      product.name = updates.name !== undefined ? updates.name : product.name;
      product.price = updates.price !== undefined ? updates.price : product.price;
      product.description = updates.description !== undefined ? updates.description : product.description;
    
      if (updates.imageUrl) {
        product.imageUrl = updates.imageUrl;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produto não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar produto no DB:', error);
    res.status(400).json({ message: 'Erro ao atualizar produto.', error: error.message });
  }
}

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Produto removido com sucesso.' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao remover produto.', error: error.message });
  }
});

module.exports = router;