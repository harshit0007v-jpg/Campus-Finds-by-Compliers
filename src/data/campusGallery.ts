export interface GalleryPreset {
  id: string;
  name: string;
  category: 'Electronics' | 'ID & Cards' | 'Wallets & Bags' | 'Keys' | 'Bottles & Containers' | 'Study & Books' | 'Clothing & Accessories';
  imageUrl: string;
  tag: string;
}

export const CAMPUS_STOCK_GALLERY: GalleryPreset[] = [
  // Electronics
  {
    id: 'gal-laptop',
    name: 'Laptop (Silver / Space Grey)',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    tag: 'Laptop',
  },
  {
    id: 'gal-headphones',
    name: 'Over-Ear Headphones (Black)',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    tag: 'Headphones',
  },
  {
    id: 'gal-earbuds',
    name: 'Wireless Earbuds & Charging Case',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
    tag: 'Earbuds',
  },
  {
    id: 'gal-phone',
    name: 'Smartphone with Dark Case',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    tag: 'Phone',
  },
  {
    id: 'gal-calculator',
    name: 'Scientific Calculator',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    tag: 'Calculator',
  },
  {
    id: 'gal-charger',
    name: 'Power Bank & USB Cable',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1609592807664-8848419eb9c5?auto=format&fit=crop&w=800&q=80',
    tag: 'Charger',
  },

  // ID & Cards
  {
    id: 'gal-idcard',
    name: 'Campus Student ID & Lanyard',
    category: 'ID & Cards',
    imageUrl: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=800&q=80',
    tag: 'Student ID',
  },
  {
    id: 'gal-badge',
    name: 'Access Badge & Cardholder',
    category: 'ID & Cards',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    tag: 'Badge',
  },

  // Wallets & Bags
  {
    id: 'gal-backpack',
    name: 'Campus Daypack / Backpack',
    category: 'Wallets & Bags',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    tag: 'Backpack',
  },
  {
    id: 'gal-wallet',
    name: 'Leather Bifold Wallet',
    category: 'Wallets & Bags',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    tag: 'Wallet',
  },
  {
    id: 'gal-tote',
    name: 'Canvas Tote Bag',
    category: 'Wallets & Bags',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    tag: 'Tote Bag',
  },

  // Keys
  {
    id: 'gal-keys',
    name: 'Metal Keyring with Dorm FOB',
    category: 'Keys',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    tag: 'Keys',
  },

  // Bottles & Containers
  {
    id: 'gal-waterbottle',
    name: 'Stainless Steel Insulated Flask',
    category: 'Bottles & Containers',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    tag: 'Flask',
  },
  {
    id: 'gal-tumbler',
    name: 'Coffee Travel Tumbler / Mug',
    category: 'Bottles & Containers',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    tag: 'Tumbler',
  },

  // Study & Books
  {
    id: 'gal-notebook',
    name: 'Hardcover Lecture Journal & Pen',
    category: 'Study & Books',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    tag: 'Notebook',
  },

  // Clothing & Accessories
  {
    id: 'gal-glasses',
    name: 'Eyeglasses / Reading Glasses',
    category: 'Clothing & Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
    tag: 'Glasses',
  },
  {
    id: 'gal-umbrella',
    name: 'Compact Folding Umbrella',
    category: 'Clothing & Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80',
    tag: 'Umbrella',
  },
  {
    id: 'gal-watch',
    name: 'Digital Wristwatch',
    category: 'Clothing & Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    tag: 'Watch',
  },
];
