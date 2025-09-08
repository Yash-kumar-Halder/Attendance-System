import { getValidToken } from '@/Utils/getValidToken.js';
import { useAppSelector } from '../../hooks/index.js';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

const Announcement = () => {
    const user = useAppSelector((state) => state.user);
    const [formData, setFormData] = useState({
        content: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);

    const fetchAnnouncements = async () => {
        setIsLoadingAnnouncements(true);
        const token = await getValidToken();
        try {
            const response = await axios.get("/announcement/get-all-announcements", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (response.data.success) {
                setAnnouncements(response.data.announcements);
            } else {
                console.error("Failed to fetch announcements:", response.data.message);
                toast.error("Failed to load announcements.");
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
            toast.error("Error loading announcements.");
        } finally {
            setIsLoadingAnnouncements(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!formData.content.trim()) {
            toast.error("Announcement content cannot be empty.");
            return;
        }

        setIsSubmitting(true);
        const token = await getValidToken();
        try {
            const response = await axios.post("/announcement/set-announcement", formData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (response.data.success) {
                toast.success("Announcement posted successfully!");
                setFormData({ content: "" });
                fetchAnnouncements();
            } else {
                const errorMessage = response.data.message || "Something went wrong. Please try again.";
                toast.error(errorMessage);
                console.error("Invalid response from server.", errorMessage);
            }
        } catch (error) {
            let userMessage = "Failed to post announcement. Please try again.";
            if (axios.isAxiosError(error) && error.response) {
                userMessage = error.response.data.message || userMessage;
                if (error.response.status === 401 || error.response.status === 403) {
                    userMessage = "Authentication error. Please log in again.";
                }
            }
            toast.error(userMessage);
            console.error("Upload failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='px-[2.5%] py-[2%] bg-[var(--bg)]'>
            <h1 className='text-[var(--white-8)] text-2xl mb-8'>Announcements</h1>

            {user.role === "teacher" && (
                <div className='mb-8'>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={formData.content}
                            onChange={handleChange}
                            name="content"
                            id="content"
                            rows="5"
                            className="w-full p-3 border border-[var(--white-5)] rounded-md bg-[var(--card)] text-[var(--white-8)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            placeholder="Type your announcement here..."
                            disabled={isSubmitting}
                        ></textarea>
                        <button
                            type="submit"
                            className="mt-4 px-6 py-2 bg-[var(--primary)] text-[var(--white-2)] active:scale-90 rounded-md hover:bg-[var(--white-7)] cursor-pointer transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Announcement'}
                        </button>
                    </form>
                </div>
            )}

            <h2 className='text-[var(--white-8)] text-xl mb-4'>Recent Announcements</h2>
            <div className='flex flex-col gap-6'>
                {isLoadingAnnouncements ? (
                    <p className="text-[var(--white-7)]">Loading announcements...</p>
                ) : announcements.length === 0 ? (
                    <p className="text-[var(--white-7)]">No announcements available yet.</p>
                ) : (
                    announcements.map((ann, index) => (
                        <div key={ann._id || index} className='bg-[var(--card)] px-5 w-fit py-3 pr-12 rounded-t-2xl rounded-l-2xl'>
                            <div className='text-[var(--white-9)] font-extrabold'>{ann.author?.name || 'Unknown Teacher'}</div>
                            <div className='text-[var(--white-7)]'>{ann.content}</div>
                            {ann.createdAt && (
                                <div className='text-[var(--white-6)] text-xs mt-1'>
                                    {/* Updated formatting here */}
                                    Posted on {new Date(ann.createdAt).toLocaleDateString("en-IN", {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                    })} at {new Date(ann.createdAt).toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Announcement;