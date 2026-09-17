import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/paymentpage.css";
import { paymentService } from "../services/paymentService";
import type { GameDto } from "../DTOs/Game/GameDto";
import { orderService } from "../services/navbarService";
import type { MiniProfileDto } from "../DTOs/Profile/MiniProfileDto";

export default function PaymentPage() {
    const navigate = useNavigate();
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [cartGames, setCartGames] = useState<GameDto[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [balance, setBalance] = useState(0);
    const [profile, setprofile] = useState<MiniProfileDto>();


    const calculateFinalPrice = (price: number, discount: number) => {
        if (discount > 0) {
            return price * (1 - discount / 100);
        }
        return price;
    };


    const subtotal = cartGames.reduce((sum, item) => sum + calculateFinalPrice(item.price, item.discount || 0), 0);
    const total = subtotal;

    const handlePurchase = async () => {
        if (!agreedToTerms) return;
        try {
            await paymentService.checkout();
            navigate("/");
        } catch (error) {
            console.error("Payment failed", error);
        }
    };

    async function GetUser() {
        try {
            const data = await orderService.getUser();
            setprofile(data);
        } catch (error) {
            console.error(error);
        }
    }
    
    async function GetBalance() {
        try {
            const data = await orderService.getBalance();
            setBalance(data);
        } catch (error) {
            console.error(error);
            setBalance(0);
        }
    }
    
    async function GetCart() {
        try {
            const data = await paymentService.getMyCart();
            setCartGames(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        GetCart();
        GetUser();
        GetBalance();
    }, []);

    return (
        <div className="payment-page-wrapper">

            <div className="checkout-header-nav">
                <span className="nav-step">Payment Info</span>
                <span className="nav-arrow">▶</span>
                <span className="nav-step active">Review + Purchase</span>
            </div>

            <div className="checkout-main-content">
                <div className="checkout-left-column">

                    <div className="checkout-items-list">
                        {cartGames.map(item => {
                            const hasDiscount = (item.discount || 0) > 0;
                            const finalPrice = calculateFinalPrice(item.price, item.discount || 0);

                            return (
                                <div key={item.id} className="checkout-item-card">
                                    <img src={item.coverImageHorizontal} alt={item.title} className="item-capsule" />
                                    <div className="item-details">
                                        <span className="item-title">{item.title}</span>
                                        <div className="item-price-area">
                                            {hasDiscount ? (
                                                <div className="discount-block">
                                                    <span className="discount-percent">-{item.discount}%</span>
                                                    <div className="price-column">
                                                        <span className="original-price">{item.price.toFixed(2)} $</span>
                                                        <span className="final-price">{finalPrice.toFixed(2)} $</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="item-price">{item.price.toFixed(2)} $</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="checkout-totals-card">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>{subtotal.toFixed(2)} $</span>
                        </div>
                        <div className="total-row grand-total">
                            <span>Total:</span>
                            <span>{total.toFixed(2)} $</span>
                        </div>
                        <p className="vat-notice">All prices include VAT where applicable</p>
                    </div>

                    <div className="checkout-payment-box">
                        <div className="payment-method-selector">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="paymentType"
                                    value="wallet"
                                    checked={paymentMethod === "wallet"}
                                    onChange={() => setPaymentMethod("wallet")}
                                />
                                <span>My Wallet ({balance.toFixed(2)} $)</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="paymentType"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={() => setPaymentMethod("card")}
                                />
                                <span>Credit / Debit Card</span>
                            </label>
                        </div>

                        {paymentMethod === "card" && (
                            <div className="card-input-form">
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group half">
                                        <label>Expiration Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group half">
                                        <label>Security Code</label>
                                        <input
                                            type="text"
                                            placeholder="CVV"
                                            maxLength={4}
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="payment-info-grid">
                            <div className="info-block">
                                <p className="label">Nexus account:</p>
                                <p className="value">{profile?.name}</p>
                            </div>
                        </div>

                        <div className="terms-container">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                            />
                            <label htmlFor="terms" className="terms-text">
                                I agree to the terms of the <a href="#">Nexus Subscriber Agreement</a> (last updated 27 Sep, 2024.)
                            </label>
                        </div>

                        <div className="purchase-action">
                            <button
                                className={`purchase-btn ${agreedToTerms ? 'active' : 'disabled'}`}
                                onClick={handlePurchase}
                                disabled={!agreedToTerms}
                            >
                                Purchase
                            </button>
                        </div>
                    </div>

                    <p className="email-confirmation">The receipt will be sent to your email address.</p>
                </div>

                <div className="checkout-right-column">
                    <div className="info-box-card">
                        <h3>PURCHASING ON NEXUS</h3>
                        <p>Once you've completed this transaction, your payment method will be debited and you'll receive an email message confirming receipt of your purchase.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}