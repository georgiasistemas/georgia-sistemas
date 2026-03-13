'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function ProductsPage() {
  const { profile } = useAuth()

  const [products, setProducts] = useState<any[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')

  async function loadProducts() {
    if (!profile?.tenant_id) return

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', profile.tenant_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao carregar produtos', error)
    } else {
      setProducts(data || [])
    }
  }

  useEffect(() => {
    loadProducts()
  }, [profile])

  async function addProduct() {
    if (!profile?.tenant_id) {
      console.error('Tenant não encontrado')
      return
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: name,
          price: Number(price),
          stock: Number(stock),
          tenant_id: profile.tenant_id,
          active: true
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao salvar produto', error)
      return
    }

    console.log('Produto criado', data)

    setName('')
    setPrice('')
    setStock('')

    loadProducts()
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
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Estoque"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button onClick={addProduct}>
          Adicionar
        </button>

      </div>

      <table border={1} cellPadding={10}>

        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
          </tr>
        </thead>

        <tbody>

          {products.map((product) => (

            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}