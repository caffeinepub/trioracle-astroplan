import React from 'react';
import { X, ShieldAlert, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCheckAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import InquiriesTab from './InquiriesTab';
import BlogManagementTab from './BlogManagementTab';

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useCheckAdmin();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-bg pt-20">
        <div className="text-center">
          <ShieldAlert size={48} className="text-gold/40 mx-auto mb-4" />
          <p className="font-serif text-xl text-charcoal/60">Please log in to access the dashboard</p>
          <button onClick={onClose} className="mt-4 btn-outline-gold text-sm">Go Back</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-bg pt-20">
        <Loader2 size={32} className="animate-spin text-gold/60" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-bg pt-20">
        <div className="text-center">
          <ShieldAlert size={48} className="text-destructive/40 mx-auto mb-4" />
          <p className="font-serif text-xl text-charcoal/60">Access Denied</p>
          <p className="text-sm text-charcoal/40 mt-1">You do not have admin privileges.</p>
          <button onClick={onClose} className="mt-4 btn-outline-gold text-sm">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-bg pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-charcoal">Admin Dashboard</h1>
            <p className="text-sm text-charcoal/50 mt-1">Manage inquiries and blog posts</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 btn-outline-gold text-sm"
          >
            <X size={14} />
            Close Dashboard
          </button>
        </div>

        <Tabs defaultValue="inquiries">
          <TabsList className="bg-gold/10 border border-gold/20 mb-6">
            <TabsTrigger value="inquiries" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              Inquiries
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              Blog Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries">
            <InquiriesTab />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManagementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
