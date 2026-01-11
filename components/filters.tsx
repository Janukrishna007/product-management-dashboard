"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface FiltersProps {
  categories: string[]
  onCategoryChange: (category: string | null) => void
  onSearchChange: (search: string) => void
  onPriceChange: (min: number, max: number) => void
  selectedCategory: string | null
}

export function Filters({
  categories,
  onCategoryChange,
  onSearchChange,
  onPriceChange,
  selectedCategory,
}: FiltersProps) {
  const [minPrice, setMinPrice] = React.useState(0)
  const [maxPrice, setMaxPrice] = React.useState(1000)

  const handlePriceChange = () => {
    onPriceChange(minPrice, maxPrice)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 glass rounded-xl border border-border/30 shadow-lg"
    >
      <div>
        <label className="text-sm font-semibold text-foreground block mb-2">Search Products</label>
        <Input
          placeholder="Search by name..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="glass border-border/30 h-10"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">Category</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(null)}
            className={selectedCategory === null ? "bg-gradient-to-r from-primary to-accent" : "border-border/30"}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={
                selectedCategory === category ? "bg-gradient-to-r from-primary to-accent" : "border-border/30 glass"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">Price Range</label>
        <div className="flex gap-3">
          <Input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            placeholder="Min"
            className="glass border-border/30"
          />
          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            placeholder="Max"
            className="glass border-border/30"
          />
          <Button size="sm" onClick={handlePriceChange} className="bg-gradient-to-r from-primary to-accent">
            Apply
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
