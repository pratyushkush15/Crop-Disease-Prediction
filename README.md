Crop
_PROJECT/
├── setup/                      # Environment setup
│   ├── env/                    # Python virtual environment
│   │   ├── Scripts/
│   │   ├── Include/
│   │   ├── Lib/
│   │   ├── .gitignore
│   │   └── pyvenv.cfg
│   |── requirements.txt        # Python dependencies
├── dataset/                    # Dataset folder                
├── models/                     
│   └── trained_Crop_disease_model.keras
│   ├── train.ipynb            
│   └── test.ipynb      
|   ├──  app.py       
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── utils/              # Utility functions
│   │   └── types/              # TypeScript types
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.html
│   ├── index.css
│   └── node_modules/           # Node dependencies
├── build/        
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── tsconfig.app.json              
├── .gitignore                  
└── README.md                   # Project documentation
