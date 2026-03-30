import React from 'react';

// Hardcoded data for a jewelry website
const customerReviews = [
  {
    id: 1,
    comment: "I purchased the Elegant Solitaire Ring, and it's even more stunning in person! The craftsmanship is exquisite, and the diamond sparkles beautifully. I get so many compliments!",
    author: 'Priya',
    location: 'Mumbai',
    avatar: '/women.png' // Placeholder avatar
  },
  {
    id: 2,
    comment: "The Golden Charm Bracelet is perfect for everyday wear. It's delicate yet durable, and the gold has a beautiful, rich hue. The service was excellent, and shipping was fast!",
    author: 'Kavya',
    location: 'Bengaluru',
    avatar: '/women.png' // Placeholder avatar
  },
  {
    id: 3,
    comment: "This is my go-to store for unique and high-quality jewelry. I love my new Pearl Drop Earrings. They're timeless and elegant, perfect for both casual and formal occasions.",
    author: 'Thahir',
    location: 'Chennai',
    avatar: '/male.jpg' // Placeholder avatar
  },
];

// Main component for the entire review section
const CustomerReviews = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>What Our Customers Are Saying</h2>
      <p style={styles.subheading}>
        Discover why our customers love our unique and high-quality jewelry.
      </p>

      <div style={styles.cardsContainer}>
        {customerReviews.map((review) => (
          <div key={review.id} style={styles.card}>
            <p style={styles.comment}>{review.comment}</p>
            <hr style={styles.separator} />
            <div style={styles.reviewerInfo}>
              <img
                src={review.avatar}
                alt={`${review.author}'s avatar`}
                style={styles.avatar}
              />
              <div>
                <strong style={styles.author}>{review.author}</strong>
                <p style={styles.location}>{review.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '50px 20px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  heading: {
    color: '#9E8569', // Updated heading color for a more luxurious feel
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subheading: {
    color: '#555',
    fontSize: '1rem',
    marginBottom: '40px',
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    margin: '0 auto',
    maxWidth: '1200px',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #dcdfe6',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    flex: '1',
    minWidth: '280px',
    maxWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  comment: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#333',
    flexGrow: 1,
  },
  separator: {
    border: 0,
    height: '1px',
    backgroundColor: '#eee',
    margin: '20px 0',
  },
  reviewerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid #ddd',
  },
  author: {
    fontSize: '1rem',
    color: '#333',
  },
  location: {
    fontSize: '0.85rem',
    color: '#777',
    marginTop: '2px',
  },
};

export default CustomerReviews;