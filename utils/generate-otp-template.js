const generateOTPTemplate = (OTP) => {
    return `<body 
          style="background-color: #f1f1f1;
          font-family: 'Courier New', Courier, monospace;
          text-align: center;"
          >
        <div>
            <div>
                <img 
                style="width: 400px;
                height: auto;
                border-radius: 5px;"
                src="https://cdn.pixabay.com/photo/2023/05/10/08/35/otp-verification-7983327_1280.png" 
                alt="poster">
            </div>

        </div>
        <div>
            <h1 style="font-size: 1.5rem;
                text-transform: uppercase;">
                One Time Password(OTP)
            </h1>
            <p 
            style="font-size: 0.8rem;"
            >Use it for Email verification only.</p>
        </div>

        <div 
            style="text-align: center;
            padding: 1px;
            font-size: 2rem;
            border-radius: 0.5rem;
            font-weight: bolder;"
        >
            <h1 
            style="width: 100%;
            margin: 0;">
                ${OTP}
            </h1>
           
        </div>

        <div class="attention">
            <br>
            <p style="color:rgba(0, 0, 0, 0.46)">Thank you</p>
            <p style="color:rgba(0, 0, 0, 0.46)">Team ASL</p>
            <br> <br>
        </div>

    </body>`
}

module.exports = generateOTPTemplate