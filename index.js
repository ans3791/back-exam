const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

app.post('/tasks', async (req, res) => {
  const { title, description, categoryName } = req.body;
  try {
    const category = await prisma.category.findUnique({ where: { name: categoryName } });
    if (!category) {
      return res.status(404).json({ error: `Category '${categoryName}' not found` });
    }
    const task = await prisma.task.create({
      data: { title, description, categoryId: category.id },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { deletedAt: null },
    include: { category: true },
  });
  res.json(tasks);
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, categoryName } = req.body;
  try {
    const category = await prisma.category.findUnique({ where: { name: categoryName } });
    if (!category) {
      return res.status(404).json({ error: `Category '${categoryName}' not found` });
    }
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, description, categoryId: category.id },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

app.listen(3000, () => console.log('Server running on port 3000'));
