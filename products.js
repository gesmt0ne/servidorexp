const fs = require('fs');

class ProductManager {
    constructor() {
        this.products = [];
    }

    getProduct() {
        return this.products;
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            fs.readFile('products.json', 'utf8', (err, data) => {
                if (err) {
                    console.error('Error al leer el archivo products.json:', err);
                    reject(err);
                    return;
                }

                const products = JSON.parse(data);
                resolve(products);
            });
        });
    }

    addProduct(productsData) {
        const { code } = productsData;

        return new Promise((resolve, reject) => {
            fs.readFile('products.json', 'utf8', (err, data) => {
                if (err) {
                    console.error('Error al leer el archivo products.json:', err);
                    reject(err);
                    return;
                }

                const products = JSON.parse(data);
                const isExistingProduct = products.some(product => product.code === code);

                if (isExistingProduct) {
                    reject(new Error("El código del producto está en uso"));
                    return;
                }

                const newProduct = {
                    id: this.generateId(),
                    ...productsData
                };

                products.push(newProduct);

                fs.writeFile('products.json', JSON.stringify(products), 'utf8', err => {
                    if (err) {
                        console.error('Error al escribir en el archivo products.json:', err);
                        reject(err);
                        return;
                    }

                    resolve();
                });
            });
        });
    }

    getProductById(productId) {
        return this.getProducts()
            .then(products => {
                const product = products.find(product => product.id === productId);

                if (!product) {
                    return Promise.reject(new Error("No se encontró el producto con el ID especificado"));
                }

                return product;
            })
            .catch(error => {
                return Promise.reject(new Error("Error al obtener los productos: " + error.message));
            });
    }

    updateProduct(productId, updatedData) {
        return this.getProducts()
            .then(products => {
                const productIndex = products.findIndex(product => product.id === productId);

                if (productIndex === -1) {
                    return Promise.reject(new Error("No se encontró el producto con el ID especificado"));
                }

                products[productIndex] = { ...products[productIndex], ...updatedData };

                return this.writeFile('products.json', JSON.stringify(products));
            })
            .then(() => {
                return "Producto actualizado exitosamente";
            })
            .catch(error => {
                return Promise.reject(new Error("Error al actualizar el producto: " + error.message));
            });
    }

    deleteProduct(productId) {
        return this.getProducts()
            .then(products => {
                const productIndex = products.findIndex(product => product.id === productId);

                if (productIndex === -1) {
                    return Promise.reject(new Error("No se encontró el producto con el ID especificado"));
                }

                products.splice(productIndex, 1);

                return this.writeFile('products.json', JSON.stringify(products));
            })
            .then(() => {
                return "Producto eliminado exitosamente";
            })
            .catch(error => {
                return Promise.reject(new Error("Error al eliminar el producto: " + error.message));
            });
    }

    writeFile(fileName, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(fileName, data, 'utf8', err => {
                if (err) {
                    console.error(`Error al escribir en el archivo ${fileName}:`, err);
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
}

const productManager = new ProductManager();

productManager.getProducts()
    .then(products => {
        console.log(products);
    })
    .catch(error => {
        console.log("Error al obtener los productos:", error.message);
    });

productManager.addProduct({
    title: "Product",
    description: "Testing product",
    price: 200,
    thumbnail: "No image",
    code: "abc123",
    stock: 25
})
    .then(() => {
        console.log("Producto agregado exitosamente");
    })
    .catch(error => {
        console.log("Error al agregar el producto:", error.message);
    });

try {
    productManager.getProducts()
        .then(products => {
            console.log(products);
        })
        .catch(error => {
            console.log("Error al obtener los productos:", error.message);
        });
} catch (error) {
    console.log("Error al obtener los productos:", error.message);
}

productManager.getProductById("id1")
    .then(product => {
        console.log("Producto encontrado:", product);
    })
    .catch(error => {
        console.log("Error al obtener el producto por ID:", error.message);
    });

productManager.updateProduct("id2", { title: "Nuevo título" })
    .then(() => {
        console.log("Producto actualizado exitosamente");
    })
    .catch(error => {
        console.log("Error al actualizar el producto:", error.message);
    });

productManager.deleteProduct("id3")
    .then(() => {
        console.log("Producto eliminado exitosamente");
    })
    .catch(error => {
        console.log("Error al eliminar el producto:", error.message);
    });