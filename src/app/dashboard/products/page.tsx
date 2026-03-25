'use client'

export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthProvider'

type Product = {
  id: string
  name: string
  price: number
}

export default function ProductsPage() {
  const { user, profile } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  // 🔄 BUSCAR PRODUTOS
  async function fetchProducts() {
    if (!profile?.tenant_id) return

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', profile.tenant_id)

    if (error) {
      console.error('Erro ao buscar produtos:', error)
    } else {
      setProducts(data || [])
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [profile])

  // ➕ ADICIONAR PRODUTO
  async function handleAddProduct() {
    if (!name || !price || !profile?.tenant_id) {
      alert('Preencha os campos corretamente')
      return
    }

    const { error } = await supabase.from('products').insert([
      {
        name,
        price: Number(price),
        tenant_id: profile.tenant_id,
      },
    ])

    if (error) {
      console.error('Erro ao adicionar:', error)
      alert('Erro ao adicionar produto')
    } else {
      setName('')
      setPrice('')
      fetchProducts()
    }
  }

  return (
    <div>
      <h1>Produtos</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Preço"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button onClick={handleAddProduct}>Adicionar</button>
      </div>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}