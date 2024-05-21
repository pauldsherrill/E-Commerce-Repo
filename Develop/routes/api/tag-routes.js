const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint


router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  Tag.create(req.body)
    .then((tag) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const tagProductIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(tagProductIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((tagProductIds) => res.status(200).json(tagProductIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });

  // create a new tag
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updatedTag = await Tag.update(
      {
        tag_name: req.body.tag_name
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    res.status(200).json(updatedTag)
    } catch (err) {
      res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
