"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  Edit3,
  Image as ImageIcon,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import type {
  Product,
  ProductCategory,
} from "@/lib/api/products";

import {
  INITIAL_PRODUCTS,
  PRODUCT_CATEGORIES,
} from "@/lib/mock/products";

const CATEGORIES = PRODUCT_CATEGORIES;

const EMPTY_FORM = {
  name: "",
  category: "Burgers" as ProductCategory,
  price: "",
  image: "/images/products/classic-chicken-burger.png",
  description: "",
};

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>(INITIAL_PRODUCTS);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<ProductCategory | "All">("All");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(
    EMPTY_FORM.image,
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function revokeBlobPreview() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  }

  function resetImageState(image = EMPTY_FORM.image) {
    revokeBlobPreview();
    setImageFile(null);
    setImagePreview(image);
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setError("");

    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please choose a JPG, PNG, or WEBP image.",
      );
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    revokeBlobPreview();

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);
  }

  function removeSelectedImage() {
    revokeBlobPreview();
    setImageFile(null);
    setImagePreview("");
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  function openAddModal() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    resetImageState(EMPTY_FORM.image);
    setError("");
    setMessage("");
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      description: product.description,
    });

    resetImageState(product.image);

    setError("");
    setMessage("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingProduct(null);
    resetImageState();
    setError("");
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    // --------------------------------------------------
    // Frontend validation
    //
    // IMPORTANT:
    // Backend must repeat all validation server-side.
    // Frontend validation is only for better UX.
    // --------------------------------------------------

    const name = form.name.trim();
    const description = form.description.trim();
    const image = imagePreview.trim();
    const price = Number(form.price);

    if (!name) {
      setError("Product name is required.");
      return;
    }

    if (name.length > 100) {
      setError(
        "Product name must be 100 characters or less.",
      );
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (price > 999999) {
      setError("Price is too high.");
      return;
    }

    if (!image) {
      setError("Product image is required.");
      return;
    }

    if (!imageFile && image.length > 500) {
      setError("Product image path is too long.");
      return;
    }

    if (description.length > 500) {
      setError(
        "Description must be 500 characters or less.",
      );
      return;
    }

    // --------------------------------------------------
    // API payload
    //
    // Backend developer will eventually receive this:
    //
    // POST  /api/products
    // PATCH /api/products/:id
    //
    // Backend must validate:
    // - authentication
    // - authorization / role
    // - name
    // - category
    // - price
    // - image
    // - description
    // - active status
    // --------------------------------------------------

    const productPayload = {
      name,
      category: form.category,
      price,
      image,
      description,
    };

    if (editingProduct) {
      // ==================================================
      // BACKEND INTEGRATION
      // ==================================================
      //
      // Later:
      //
      // 1. If imageFile exists, upload it first:
      //    POST /api/uploads/products
      //    multipart/form-data
      //
      // 2. Receive the permanent image URL.
      //
      // 3. Send that URL with updateProduct().
      //
      // await updateProduct(
      //   editingProduct.id,
      //   {
      //     ...productPayload,
      //     image: uploadedImageUrl,
      //   },
      // );
      //
      // Expected API:
      // PATCH /api/products/:id
      //
      // ==================================================

      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...productPayload,
              }
            : product,
        ),
      );

      setMessage("Product updated successfully.");
    } else {
      // ==================================================
      // BACKEND INTEGRATION
      // ==================================================
      //
      // Later:
      //
      // 1. Upload imageFile to the backend if selected.
      // 2. Receive the permanent image URL.
      // 3. Create the product with that URL.
      //
      // const uploadedImageUrl = await uploadProductImage(imageFile);
      //
      // const createdProduct =
      //   await createProduct({
      //     ...productPayload,
      //     image: uploadedImageUrl,
      //   });
      //
      // Expected API:
      // POST /api/products
      //
      // The backend should return the real database ID.
      //
      // ==================================================

      const newProduct: Product = {
        id: `product-${Date.now()}`,
        ...productPayload,
        active: true,
      };

      setProducts((current) => [
        newProduct,
        ...current,
      ]);

      setMessage("Product added successfully.");
    }

    closeModal();
  }

  function toggleProduct(productId: string) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              active: !product.active,
            }
          : product,
      ),
    );

    setMessage("Product status updated.");
  }

  function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`,
    );

    if (!confirmed) return;

    setProducts((current) =>
      current.filter(
        (item) => item.id !== product.id,
      ),
    );

    setMessage("Product deleted successfully.");
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            Restaurant Management
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Products
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Manage menu items, prices, categories and
            availability.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-lg"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Total Products
          </p>

          <p className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">
            {products.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Active
          </p>

          <p className="mt-3 text-2xl font-extrabold text-green-600">
            {
              products.filter(
                (product) => product.active,
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Inactive
          </p>

          <p className="mt-3 text-2xl font-extrabold text-gray-500">
            {
              products.filter(
                (product) => !product.active,
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Categories
          </p>

          <p className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">
            {CATEGORIES.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
              className="h-11 w-full rounded-xl border border-[var(--color-border)] pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value as
                  | ProductCategory
                  | "All",
              )
            }
            className="h-11 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)] lg:w-56"
          >
            <option value="All">
              All categories
            </option>

            {CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-left">
                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Product
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Category
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Price
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--color-background)]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[var(--color-text)]">
                          {product.name}
                        </p>

                        <p className="mt-1 max-w-sm text-xs text-[var(--color-text-muted)]">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[var(--color-background)] px-2.5 py-1 text-[10px] font-bold text-[var(--color-text-secondary)]">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-[var(--color-text)]">
                    ${product.price.toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        toggleProduct(product.id)
                      }
                      className={`rounded-full px-3 py-1 text-[10px] font-bold transition ${
                        product.active
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {product.active
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(product)
                        }
                        aria-label={`Edit ${product.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)]"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProduct(product)
                        }
                        aria-label={`Delete ${product.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-10 text-center">
            <Package
              size={28}
              className="mx-auto text-[var(--color-text-muted)]"
            />

            <p className="mt-3 text-sm font-bold text-[var(--color-text)]">
              No products found
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Try another search or category.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Product Management
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[var(--color-text)]">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-background)]"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* Product name */}
              <div>
                <label
                  htmlFor="product-name"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Product name
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Classic Chicken Burger"
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="product-category"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Category
                </label>

                <select
                  id="product-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category:
                        event.target.value as ProductCategory,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)]"
                >
                  {CATEGORIES.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="product-price"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Price
                </label>

                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  placeholder="8.50"
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Image upload */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="product-image"
                    className="block text-xs font-bold text-[var(--color-text)]"
                  >
                    Product image
                  </label>

                  <span className="text-[10px] font-medium text-[var(--color-text-muted)]">
                    JPG, PNG, WEBP • Max 5MB
                  </span>
                </div>

                <input
                  id="product-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="sr-only"
                />

                <div className="overflow-hidden rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)]">
                  <div className="flex flex-col items-center justify-center p-5 text-center">
                    <div className="h-32 w-32 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon
                            size={30}
                            className="text-[var(--color-text-muted)]"
                          />
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-sm font-bold text-[var(--color-text)]">
                      {imageFile
                        ? imageFile.name
                        : "Upload a product image"}
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--color-text-muted)]">
                      Choose a clear product photo. You can
                      replace it anytime before saving.
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <label
                        htmlFor="product-image"
                        className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-xs font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
                      >
                        <ImageIcon size={15} />
                        {imagePreview
                          ? "Replace Image"
                          : "Upload Image"}
                      </label>

                      {imagePreview &&
                        imageFile && (
                          <button
                            type="button"
                            onClick={removeSelectedImage}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-4 text-xs font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)]"
                          >
                            Remove
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="product-description"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Description
                </label>

                <textarea
                  id="product-description"
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description:
                        event.target.value,
                    }))
                  }
                  placeholder="Describe the product..."
                  className="w-full resize-none rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 flex-1 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-11 flex-1 rounded-xl bg-[var(--color-primary)] text-sm font-bold text-white hover:bg-[var(--color-primary-hover)]"
                >
                  {editingProduct
                    ? "Save Changes"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}