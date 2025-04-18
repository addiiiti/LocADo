import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Checkout } from '../../components/payment/Checkout';

export function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) {
        setError('Campaign ID is missing');
        setLoading(false);
        return;
      }

      try {
        const campaignDoc = await getDoc(doc(db, 'campaigns', id));
        
        if (!campaignDoc.exists()) {
          setError('Campaign not found');
          setLoading(false);
          return;
        }
        
        setCampaign({ id: campaignDoc.id, ...campaignDoc.data() });
      } catch (err) {
        setError('Error loading campaign');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handlePaymentSuccess = () => {
    // You could update the campaign status or navigate elsewhere
    alert('Payment successful!');
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">Loading campaign details...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
          {error || 'Campaign details could not be loaded'}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{campaign.title}</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Campaign Details</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500">Budget:</span>{' '}
                  <span className="font-medium">${campaign.budget}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>{' '}
                  <span className="font-medium capitalize">{campaign.status || 'Draft'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>{' '}
                  <span className="font-medium">{campaign.location || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>{' '}
                  <span className="font-medium capitalize">{campaign.category || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Timeline</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500">Created:</span>{' '}
                  <span className="font-medium">
                    {campaign.createdAt ? new Date(campaign.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Start Date:</span>{' '}
                  <span className="font-medium">
                    {campaign.startDate ? new Date(campaign.startDate.toDate()).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>{' '}
                  <span className="font-medium">
                    {campaign.endDate ? new Date(campaign.endDate.toDate()).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Payment Status:</span>{' '}
                  <span className={`font-medium ${campaign.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {campaign.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {campaign.description || 'No description provided.'}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {campaign.requirements || 'No specific requirements.'}
            </p>
          </div>

          {campaign.influencerId && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Assigned Influencer</h2>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-3">
                  {campaign.influencerName ? campaign.influencerName.charAt(0).toUpperCase() : 'I'}
                </div>
                <div>
                  <div className="font-medium">{campaign.influencerName || 'Unnamed Influencer'}</div>
                  <div className="text-sm text-gray-500">{campaign.influencerEmail || ''}</div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Actions */}
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Payment</h2>
              {campaign.paymentStatus !== 'paid' && campaign.influencerId && (
                <button
                  onClick={() => setShowPayment(!showPayment)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showPayment ? 'Hide Payment' : 'Process Payment'}
                </button>
              )}
              {campaign.paymentStatus === 'paid' && (
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Payment Completed
                </div>
              )}
            </div>

            {showPayment && campaign.influencerId && (
              <div className="mt-6">
                <Checkout
                  campaignId={id || ''}
                  influencerId={campaign.influencerId}
                  amount={campaign.budget ? Math.round(parseFloat(campaign.budget) * 100) : 1000}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPayment(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 