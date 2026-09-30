"use client";

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";
import {
  Edit3,
  Image as ImageIcon,
  Package,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import type {
  Product,
  ProductCategory,
} from "@/lib/api/products";

import type { Category } from "@/lib/api/categories";

import { uploadProductImage } from "@/lib/api/uploads";

import {
  INITIAL_PRODUCTS,
  PRODUCT_CATEGORIES,
} from "@/lib/mock/products";

const CATEGORIES = PRODUCT_CATEGORIES;

const EMPTY_FORM = {
  name: "",
  category: "Burgers" as ProductCategory,
  price: "",
  image: "",
  description: "",
};

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>(INITIAL_PRODUCTS);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState<ProductCategory | "All">("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [error, setError] = useState("");

  const [message, setMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [categories, setCategories] =
    useState<Category[]>(
      CATEGORIES.map((name) => ({
        id: name
          .toLowerCase()
          .replace(/\s+/g, "-"),
        name,
        active: true,
      })),
    );

  const [showCategoryManager, setShowCategoryManager] =
    useState(false);

  const [categoryName, setCategoryName] =
    useState("");

  const [editingCategoryId, setEditingCategoryId] =
    useState<string | null>(null);

  const [categoryError, setCategoryError] =
    useState("");

  function revokeBlobPreview() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  }

  function resetImageState(
    image = "",
  ) {
    revokeBlobPreview();

    setImageFile(null);
    setImagePreview(image);
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setError("");

    const file =
      event.target.files?.[0];

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
      setError(
        "Image must be 5MB or smaller.",
      );

      event.target.value = "";

      return;
    }

    revokeBlobPreview();

    const previewUrl =
      URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);

    /*
     * Reset the native input value.
     *
     * This allows selecting the same
     * image again after removing it.
     */
    event.target.value = "";
  }

  function removeSelectedImage() {
    if (isSubmitting) return;

    revokeBlobPreview();

    setImageFile(null);
    setImagePreview("");
  }

  function openCategoryManager() {
    if (isSubmitting) return;

    setCategoryError("");
    setCategoryName("");
    setEditingCategoryId(null);
    setShowCategoryManager(true);
  }

  function closeCategoryManager() {
    if (isSubmitting) return;

    setShowCategoryManager(false);
    setCategoryError("");
    setCategoryName("");
    setEditingCategoryId(null);
  }

  function submitCategory() {
    const name =
      categoryName.trim();

    if (!name) {
      setCategoryError(
        "Category name is required.",
      );

      return;
    }

    if (name.length > 50) {
      setCategoryError(
        "Category name must be 50 characters or less.",
      );

      return;
    }

    const duplicate =
      categories.some(
        (category) =>
          category.id !==
            editingCategoryId &&
          category.name.toLowerCase() ===
            name.toLowerCase(),
      );

    if (duplicate) {
      setCategoryError(
        "This category already exists.",
      );

      return;
    }

    if (editingCategoryId) {
      const current =
        categories.find(
          (category) =>
            category.id ===
            editingCategoryId,
        );

      if (!current) return;

      const oldName =
        current.name;

      setCategories((items) =>
        items.map((category) =>
          category.id ===
          editingCategoryId
            ? {
                ...category,
                name,
              }
            : category,
        ),
      );

      setProducts((items) =>
        items.map((product) =>
          product.category ===
          oldName
            ? {
                ...product,
                category: name,
              }
            : product,
        ),
      );

      setMessage(
        "Category updated successfully.",
      );
    } else {
      const id =
        `category-${Date.now()}`;

      setCategories((items) => [
        ...items,
        {
          id,
          name,
          active: true,
        },
      ]);

      setMessage(
        "Category added successfully.",
      );
    }

    setCategoryName("");
    setEditingCategoryId(null);
    setCategoryError("");
  }

  function editCategory(
    category: Category,
  ) {
    setEditingCategoryId(
      category.id,
    );

    setCategoryName(
      category.name,
    );

    setCategoryError("");
  }

  function toggleCategory(
    category: Category,
  ) {
    setCategories((items) =>
      items.map((item) =>
        item.id === category.id
          ? {
              ...item,
              active: !item.active,
            }
          : item,
      ),
    );

    setMessage(
      `Category ${
        category.active
          ? "deactivated"
          : "activated"
      }.`,
    );
  }

  function deleteCategory(
    category: Category,
  ) {
    const usedByProducts =
      products.some(
        (product) =>
          product.category ===
          category.name,
      );

    if (usedByProducts) {
      setCategoryError(
        `"${category.name}" is used by existing products. Deactivate it instead of deleting it.`,
      );

      return;
    }

    if (
      !window.confirm(
        `Delete "${category.name}"?`,
      )
    ) {
      return;
    }

    setCategories((items) =>
      items.filter(
        (item) =>
          item.id !== category.id,
      ),
    );

    setMessage(
      "Category deleted successfully.",
    );
  }

  const filteredProducts =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return products.filter(
        (product) => {
          const matchesSearch =
            !query ||
            product.name
              .toLowerCase()
              .includes(query) ||
            product.category
              .toLowerCase()
              .includes(query);

          const matchesCategory =
            categoryFilter ===
              "All" ||
            product.category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesCategory
          );
        },
      );
    }, [
      products,
      search,
      categoryFilter,
    ]);

  function openAddModal() {
    if (isSubmitting) return;

    setEditingProduct(null);

    setForm(EMPTY_FORM);

    resetImageState("");

    setError("");
    setMessage("");

    setShowModal(true);
  }

  function openEditModal(
    product: Product,
  ) {
    if (isSubmitting) return;

    setEditingProduct(product);

    setForm({
      name: product.name,
      category: product.category,
      price:
        product.price.toString(),
      image: product.image,
      description:
        product.description,
    });

    resetImageState(
      product.image,
    );

    setError("");
    setMessage("");

    setShowModal(true);
  }

  function closeModal() {
    if (isSubmitting) return;

    setShowModal(false);

    setEditingProduct(null);

    resetImageState("");

    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setMessage("");

    const name =
      form.name.trim();

    const description =
      form.description.trim();

    const price =
      Number(form.price);

    // -----------------------------------------
    // Frontend validation
    // -----------------------------------------

    if (!name) {
      setError(
        "Product name is required.",
      );

      return;
    }

    if (name.length > 100) {
      setError(
        "Product name must be 100 characters or less.",
      );

      return;
    }

    if (!form.category) {
      setError(
        "Please select a category.",
      );

      return;
    }

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError(
        "Please enter a valid price.",
      );

      return;
    }

    if (price > 999999) {
      setError(
        "Price is too high.",
      );

      return;
    }

    if (!imagePreview) {
      setError(
        "Please upload a product image.",
      );

      return;
    }

    if (description.length > 500) {
      setError(
        "Description must be 500 characters or less.",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      // -----------------------------------------
      // Product image upload
      // -----------------------------------------

      let imageUrl =
        imagePreview;

      if (imageFile) {
        setMessage(
          "Uploading product image...",
        );

        const uploadResponse =
          await uploadProductImage(
            imageFile,
          );

        imageUrl =
          uploadResponse.url;

        if (!imageUrl) {
          setError(
            "Image upload completed but no image URL was returned.",
          );

          setMessage("");

          return;
        }
      } else {
        setMessage(
          editingProduct
            ? "Saving product..."
            : "Adding product...",
        );
      }

      // -----------------------------------------
      // Product payload
      // -----------------------------------------

      const productPayload = {
        name,
        category:
          form.category,
        price,
        image: imageUrl,
        description,
      };

      // -----------------------------------------
      // Backend integration
      //
      // When backend is ready:
      //
      // Create:
      //
      // const createdProduct =
      //   await createProduct(
      //     productPayload,
      //   );
      //
      // Update:
      //
      // const updatedProduct =
      //   await updateProduct(
      //     editingProduct.id,
      //     productPayload,
      //   );
      // -----------------------------------------

      if (editingProduct) {
        setProducts((current) =>
          current.map(
            (product) =>
              product.id ===
              editingProduct.id
                ? {
                    ...product,
                    ...productPayload,
                  }
                : product,
          ),
        );

        setMessage(
          "Product updated successfully.",
        );
      } else {
        const newProduct: Product = {
          id: `product-${Date.now()}`,
          ...productPayload,
          active: true,
        };

        setProducts((current) => [
          newProduct,
          ...current,
        ]);

        setMessage(
          "Product added successfully.",
        );
      }

      /*
       * Close modal manually here because
       * isSubmitting is still true.
       */
      setShowModal(false);
      setEditingProduct(null);

      revokeBlobPreview();

      setImageFile(null);
      setImagePreview("");

      setForm(EMPTY_FORM);
    } catch (uploadError) {
      console.error(
        "Product image upload failed:",
        uploadError,
      );

      setMessage("");

      setError(
        "Image upload failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleProduct(
    productId: string,
  ) {
    if (isSubmitting) return;

    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              active:
                !product.active,
            }
          : product,
      ),
    );

    setMessage(
      "Product status updated.",
    );
  }

  function deleteProduct(
    product: Product,
  ) {
    if (isSubmitting) return;

    const confirmed =
      window.confirm(
        `Delete "${product.name}"?`,
      );

    if (!confirmed) return;

    setProducts((current) =>
      current.filter(
        (item) =>
          item.id !== product.id,
      ),
    );

    setMessage(
      "Product deleted successfully.",
    );
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
            Manage menu items, prices,
            categories and availability.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={
              openCategoryManager
            }
            disabled={
              isSubmitting
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Package size={17} />
            Manage Categories
          </button>

          <button
            type="button"
            onClick={
              openAddModal
            }
            disabled={
              isSubmitting
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
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
                (product) =>
                  product.active,
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
                (product) =>
                  !product.active,
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Categories
          </p>

          <p className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">
            {categories.length}
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
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search products..."
              className="h-11 w-full rounded-xl border border-[var(--color-border)] pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>

          <select
            value={
              categoryFilter
            }
            onChange={(event) =>
              setCategoryFilter(
                event.target
                  .value as
                  | ProductCategory
                  | "All",
              )
            }
            className="h-11 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)] lg:w-56"
          >
            <option value="All">
              All categories
            </option>

            {categories
              .filter(
                (category) =>
                  category.active,
              )
              .map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.name
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                ),
              )}
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
              {filteredProducts.map(
                (product) => (
                  <tr
                    key={
                      product.id
                    }
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--color-background)]">
                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[var(--color-text)]">
                            {
                              product.name
                            }
                          </p>

                          <p className="mt-1 max-w-sm text-xs text-[var(--color-text-muted)]">
                            {
                              product.description
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[var(--color-background)] px-2.5 py-1 text-[10px] font-bold text-[var(--color-text-secondary)]">
                        {
                          product.category
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-[var(--color-text)]">
                      $
                      {product.price.toFixed(
                        2,
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          toggleProduct(
                            product.id,
                          )
                        }
                        disabled={
                          isSubmitting
                        }
                        className={`rounded-full px-3 py-1 text-[10px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
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
                            openEditModal(
                              product,
                            )
                          }
                          disabled={
                            isSubmitting
                          }
                          aria-label={`Edit ${product.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Edit3
                            size={15}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProduct(
                              product,
                            )
                          }
                          disabled={
                            isSubmitting
                          }
                          aria-label={`Delete ${product.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {filteredProducts.length ===
          0 && (
          <div className="p-10 text-center">
            <Package
              size={28}
              className="mx-auto text-[var(--color-text-muted)]"
            />

            <p className="mt-3 text-sm font-bold text-[var(--color-text)]">
              No products found
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Try another search or
              category.
            </p>
          </div>
        )}
      </div>

      {/* Category manager modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Menu Structure
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[var(--color-text)]">
                  Manage Categories
                </h3>
              </div>

              <button
                type="button"
                onClick={
                  closeCategoryManager
                }
                disabled={
                  isSubmitting
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={
                      categoryName
                    }
                    onChange={(
                      event,
                    ) => {
                      setCategoryName(
                        event.target
                          .value,
                      );

                      setCategoryError(
                        "",
                      );
                    }}
                    placeholder={
                      editingCategoryId
                        ? "Rename category..."
                        : "New category name..."
                    }
                    maxLength={50}
                    className="h-11 min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)]"
                  />

                  <button
                    type="button"
                    onClick={
                      submitCategory
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white hover:bg-[var(--color-primary-hover)]"
                  >
                    <Plus size={16} />

                    {editingCategoryId
                      ? "Save Category"
                      : "Add Category"}
                  </button>
                </div>

                {categoryError && (
                  <p className="mt-3 text-xs font-semibold text-red-600">
                    {
                      categoryError
                    }
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {categories.map(
                  (category) => (
                    <div
                      key={
                        category.id
                      }
                      className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--color-text)]">
                          {
                            category.name
                          }
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            category.active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {category.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            editCategory(
                              category,
                            )
                          }
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--color-border)] px-3 text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleCategory(
                              category,
                            )
                          }
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--color-border)] px-3 text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                        >
                          {category.active
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteCategory(
                              category,
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${category.name}`}
                        >
                          <Trash2
                            size={14}
                          />
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <p className="text-[11px] leading-5 text-[var(--color-text-muted)]">
                Categories used by
                existing products
                cannot be deleted.
                Deactivate them
                instead. Backend will
                enforce the same rule
                in production.
              </p>
            </div>
          </div>
        </div>
      )}

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
                onClick={
                  closeModal
                }
                disabled={
                  isSubmitting
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
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
                  value={
                    form.name
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        name: event
                          .target
                          .value,
                      }),
                    )
                  }
                  placeholder="Classic Chicken Burger"
                  maxLength={100}
                  disabled={
                    isSubmitting
                  }
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:bg-gray-50"
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
                  value={
                    form.category
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        category:
                          event
                            .target
                            .value as ProductCategory,
                      }),
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  {categories
                    .filter(
                      (category) =>
                        category.active ||
                        category.name ===
                          form.category,
                    )
                    .map(
                      (category) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.name
                          }
                        >
                          {
                            category.name
                          }

                          {!category.active &&
                          category.name ===
                            form.category
                            ? " (Inactive)"
                            : ""}
                        </option>
                      ),
                    )}
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
                  value={
                    form.price
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        price:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  placeholder="8.50"
                  disabled={
                    isSubmitting
                  }
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              {/* Product image */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="product-image"
                    className="block text-xs font-bold text-[var(--color-text)]"
                  >
                    Product image
                  </label>

                  <span className="text-[10px] font-medium text-[var(--color-text-muted)]">
                    JPG, PNG, WEBP • Max
                    5MB
                  </span>
                </div>

                <input
                  id="product-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleImageChange
                  }
                  disabled={
                    isSubmitting
                  }
                  className="sr-only"
                />

                <div className="overflow-hidden rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)]">
                  {!imagePreview ? (
                    /*
                     * Upload placeholder
                     */
                    <label
                      htmlFor="product-image"
                      className={`group flex min-h-[250px] cursor-pointer flex-col items-center justify-center p-6 text-center transition ${
                        isSubmitting
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-white"
                      }`}
                    >
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                        <UploadCloud
                          size={34}
                          strokeWidth={1.7}
                          className="text-[var(--color-primary)] transition-transform duration-300 group-hover:-translate-y-1"
                        />

                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                          +
                        </span>
                      </div>

                      <p className="mt-5 text-sm font-extrabold text-[var(--color-text)]">
                        Upload product image
                      </p>

                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        Click here to choose
                        an image
                      </p>

                      <p className="mt-3 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[var(--color-text-muted)] shadow-sm">
                        JPG • PNG • WEBP •
                        Max 5MB
                      </p>
                    </label>
                  ) : (
                    /*
                     * Selected/existing image
                     */
                    <div className="flex flex-col items-center justify-center p-5 text-center">
                      <div className="h-32 w-32 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
                        <img
                          src={
                            imagePreview
                          }
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <p className="mt-4 max-w-xs truncate text-sm font-bold text-[var(--color-text)]">
                        {imageFile
                          ? imageFile.name
                          : "Current product image"}
                      </p>

                      <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--color-text-muted)]">
                        {imageFile
                          ? "Image selected. You can replace it before saving."
                          : "You can replace the current image before saving."}
                      </p>

                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <label
                          htmlFor="product-image"
                          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-xs font-bold text-white transition ${
                            isSubmitting
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer hover:bg-[var(--color-primary-hover)]"
                          }`}
                        >
                          <ImageIcon
                            size={15}
                          />

                          Replace Image
                        </label>

                        {imageFile && (
                          <button
                            type="button"
                            onClick={
                              removeSelectedImage
                            }
                            disabled={
                              isSubmitting
                            }
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-4 text-xs font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )}
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
                  value={
                    form.description
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        description:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  placeholder="Describe the product..."
                  maxLength={500}
                  disabled={
                    isSubmitting
                  }
                  className="w-full resize-none rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    isSubmitting
                  }
                  className="h-11 flex-1 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                  className="h-11 flex-1 rounded-xl bg-[var(--color-primary)] text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? imageFile
                      ? "Uploading..."
                      : editingProduct
                        ? "Saving..."
                        : "Adding..."
                    : editingProduct
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