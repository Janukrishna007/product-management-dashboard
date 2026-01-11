"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

export function ProductFilters() {
    const { searchQuery, selectedCategory, priceRange, setSearchQuery, setCategory, setPriceRange, clearFilters } = useAuthStore()
    const [localSearch, setLocalSearch] = useState(searchQuery)
    const [minPrice, setMinPrice] = useState(priceRange[0])
    const [maxPrice, setMaxPrice] = useState(priceRange[1])

    // Fetch categories
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await fetch("https://dummyjson.com/products/categories")
            return response.json()
        },
    })

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localSearch)
        }, 300)
        return () => clearTimeout(timer)
    }, [localSearch, setSearchQuery])

    // Update price range
    useEffect(() => {
        setPriceRange([minPrice, maxPrice])
    }, [minPrice, maxPrice, setPriceRange])

    const handleClearFilters = () => {
        setLocalSearch("")
        setMinPrice(0)
        setMaxPrice(10000)
        clearFilters()
    }

    const hasActiveFilters = searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Clear All
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                    <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                        Search Products
                    </Label>
                    <div className="relative mt-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="search"
                            type="text"
                            placeholder="Search by name..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Category
                    </Label>
                    <Select value={selectedCategory || "all"} onValueChange={(value) => setCategory(value === "all" ? "" : value)}>
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories?.map((category: any) => (
                                <SelectItem key={category.slug} value={category.slug}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Range */}
                <div>
                    <Label className="text-sm font-medium text-gray-700">Price Range (INR)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            min={0}
                        />
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            min={0}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        ₹{minPrice * 83} - ₹{maxPrice * 83}
                    </p>
                </div>
            </div>
        </div>
    )
}
