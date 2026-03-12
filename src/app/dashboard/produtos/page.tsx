'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

type Product = {
  id: string
  name: string
  price: number
  stock: number
}

export default function ProdutosPage() {

  const { profile } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')

  async function loadProducts() {

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', profile?.tenant_id)

    if (data) {
      setProducts(data)
    }
  }

  useEffect(() => {
    if (profile) {
      loadProducts()
    }
  }, [profile])

  async function addProduct(e: any) {

    e.preventDefault()

    await supabase.from('products').insert([
      {
        name,
        price: Number(price),
        stock: Number(stock),
        tenant_id: profile?.tenant_id
      }
    ])

    setName('')
    setPrice('')
    setStock('')

    loadProducts()
  }

  return (
    <div>

      <h1>Produtos</h1>

      <form
        onSubmit={addProduct}
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px'
        }}
      >

        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Estoque"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button type="submit">
          Adicionar
        </button>

      </form>

      <table border={1} cellPadding={10}>

        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
          </tr>
        </thead>

        <tbody>

          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>R$ {p.price}</td>
              <td>{p.stock}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}