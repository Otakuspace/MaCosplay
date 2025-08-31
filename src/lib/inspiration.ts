// Inspiration management utilities

export interface InspirationItem {
    id: string;
    Name: string;
    Details?: string;
    Desc?: string;
    Image: string;
    price?: number;
    price_pri?: number;
    price_test?: number;
    isPriTest?: boolean;
    Size?: string;
    Province?: string;
    brand?: string;
    series?: string;
    gender?: string;
    Status?: string;
    created?: string;
    tags?: string[];
    addedAt: string;
    inspirationId: string;
}

export class InspirationManager {
    private static STORAGE_KEY = 'cosplay_inspiration';
    
    static getAll(): InspirationItem[] {
        if (typeof window === 'undefined') return [];
        
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading inspiration items:', error);
            return [];
        }
    }
    
    static add(item: any): InspirationItem {
        const inspirationItem: InspirationItem = {
            ...item,
            addedAt: new Date().toISOString(),
            inspirationId: `inspiration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        const items = this.getAll();
        
        // Check if item already exists
        if (items.some(existing => existing.id === item.id)) {
            throw new Error('Item already in inspiration');
        }
        
        items.push(inspirationItem);
        this.save(items);
        
        return inspirationItem;
    }
    
    static remove(inspirationId: string): boolean {
        const items = this.getAll();
        const filteredItems = items.filter(item => item.inspirationId !== inspirationId);
        
        if (filteredItems.length === items.length) {
            return false; // Item not found
        }
        
        this.save(filteredItems);
        return true;
    }
    
    static clear(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    }
    
    static isInInspiration(itemId: string): boolean {
        return this.getAll().some(item => item.id === itemId);
    }
    
    static getCategories(): string[] {
        const items = this.getAll();
        const categories = new Set<string>();
        
        items.forEach(item => {
            if (item.series) categories.add(item.series);
            if (item.brand) categories.add(item.brand);
        });
        
        return Array.from(categories).sort();
    }
    
    static getStats() {
        const items = this.getAll();
        const today = new Date().toDateString();
        
        return {
            total: items.length,
            totalValue: items.reduce((sum, item) => sum + (item.price || 0), 0),
            categories: this.getCategories().length,
            addedToday: items.filter(item => 
                new Date(item.addedAt).toDateString() === today
            ).length
        };
    }
    
    static search(query: string, category?: string): InspirationItem[] {
        const items = this.getAll();
        
        return items.filter(item => {
            const matchesSearch = !query || 
                item.Name.toLowerCase().includes(query.toLowerCase()) ||
                (item.Details && item.Details.toLowerCase().includes(query.toLowerCase())) ||
                (item.Desc && item.Desc.toLowerCase().includes(query.toLowerCase()));
            
            const matchesCategory = !category || 
                item.series === category || 
                item.brand === category;
            
            return matchesSearch && matchesCategory;
        });
    }
    
    private static save(items: InspirationItem[]): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        }
    }
}

// Toast notification utility
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success', theme: 'light' | 'dark' = 'light') {
    if (typeof window === 'undefined') return;
    
    const toast = document.createElement('div');
    
    const bgClass = type === 'success' 
        ? (theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800')
        : type === 'error' 
        ? (theme === 'dark' ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800')
        : (theme === 'dark' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800');
    
    toast.className = `fixed top-20 right-4 z-50 ${bgClass} px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}