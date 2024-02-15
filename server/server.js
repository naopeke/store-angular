const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');

const app = express();
app.use(express.static('public'));
//Expressアプリケーションで body-parser ミドルウェアを使用して、URLエンコードされたフォームデータを処理するための設定です。
//具体的には、body-parser パッケージの urlencoded メソッドを使用して、ExpressアプリケーションでURLエンコードされたデータを解析および処理できるようにします。extended: false オプションは、解析されたデータがネストしたオブジェクト形式ではなく、フラットなオブジェクト形式であることを指定します。
//これにより、Expressアプリケーションでフォームデータを処理できるようになります。たとえば、HTMLのフォームから送信されたデータを取得する場合などに使用されます。
//これを使用することで、req.body を介してExpressルートハンドラ内でフォームデータにアクセスできるようになります。
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

const stripe = require('stripe')('sk_test_51Ok0l2LfW4b0Aq2gmRu9rSFW2WtJ84Jov0bzjsidgBymGQJlossKetaGn9gy5R210hiI4QXpqcaKKlwANTIN0Bt200eQuTzHgU');

app.post('/checkout', async(req, res, next)=>{
    try{
        // cart.component.tsの sessionId:res.idより
        const session = await stripe.checkout.sessions.create({

            //shipping details
            payment_method_types: ['card'],
            shipping_address_collection:{
                allowed_countries:['ES'],
            },
            shipping_options:[
                {
                    shipping_rate_data:{
                        type: 'fixed_amount',
                        fixed_amount:{
                            amount:0,
                            currency:'eur',
                        },
                        display_name: 'Free shipping',
                        delivery_estimate:{
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value:7,
                            },
                        }

                    }
                },
                {
                    shipping_rate_data:{
                        type: 'fixed_amount',
                        fixed_amount:{
                            amount:1500,
                            currency:'eur',
                        },
                        display_name: 'Next day air',
                        delivery_estimate:{
                            minimum: {
                                unit: 'business_day',
                                value: 1,
                            },
                            maximum: {
                                unit: 'business_day',
                                value:3,
                            },
                        }

                    }
                }
            ],


            // payment
            line_items: req.body.items.map((item)=> ({
                price_data:{
                    currency: 'eur',
                    product_data:{
                        name: item.name,
                        images: [item.product]
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,

            })),
            mode: 'payment',
            success_url: 'http://localhost:4242/success.html',
            cancel_url: 'http://localhost:4242/cancel.html',
        });
        res.status(200).json(session);
    } catch (error){
        next(error);
    }
});

app.listen(4242, ()=> console.log('app is running on 4242'));