import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";


import { useFirebase } from "../context/Firebase";
import { Spinner } from "react-bootstrap";

const BookCard = (props) => {
    const firebase = useFirebase();
    const navigate = useNavigate();

    const [url, setURL] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            firebase.getImageUrl(props.imageURL).then((url) => {
                setURL(url);
                setLoading(false);
            });
    }, 1000); // Adjust this delay according to your needs or remove it for real data fetching

            return () => clearTimeout(timer);
        }, [firebase, props.imageURL]);

        return (
            <Col xs={12} sm={6} md={4}>
                <Card style={{ marginBottom: "20px" }}>
                    {loading ? (
                        <center>
                            <Spinner
                                animation="grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </center>
                    ) : (
                        <>
                            <Card.Img variant="top" src={url} />
                            <Card.Body>
                                <Card.Title>{props.name}</Card.Title>
                                <Card.Text>
                                    This book has a title {props.name} and this book is sold by{" "}
                                    {props.displayName} and this book costs Rs.{props.price}
                                </Card.Text>
                                <Button onClick={(e) => navigate(props.link)} variant="primary">
                                    View
                                </Button>
                            </Card.Body>
                        </>
                    )}
                </Card>
            </Col>
        );
    };

    export default BookCard;
