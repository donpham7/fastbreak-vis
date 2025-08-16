import time
import torch
import torch.nn as nn
import torch.nn.functional as F
import pandas as pd
from gamePredModel import GamePredModel, mdn_loss
from torch.utils.data import TensorDataset, DataLoader
from sklearn.model_selection import train_test_split

model = GamePredModel(input_dim=420, hidden_dim=784, n_components=360)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = mdn_loss
num_epochs = 3

df = pd.read_csv("../csv/masterGame.csv").iloc[:5000]

# Step 2: Split features and target
X = df.iloc[:, -420:]
y = df.iloc[:, 6:-420]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Step 4: To tensors
X_train_tensor = torch.tensor(X_train.values, dtype=torch.float32)
y_train_tensor = torch.tensor(y_train.values, dtype=torch.float32)

X_test_tensor = torch.tensor(X_test.values, dtype=torch.float32)
y_test_tensor = torch.tensor(y_test.values, dtype=torch.float32)

# Step 5: DataLoader
train_loader = DataLoader(
    TensorDataset(X_train_tensor, y_train_tensor), batch_size=16, shuffle=True
)
test_loader = DataLoader(TensorDataset(X_test_tensor, y_test_tensor), batch_size=16)
print(df.shape)
df.describe()

for epoch in range(num_epochs):
    model.train()
    total_loss = 0.0
    epoch_start = time.time()

    for i, (batch_x, batch_y) in enumerate(train_loader, 1):
        batch_start = time.time()
        optimizer.zero_grad()

        # Forward pass
        pi, mu, sigma = model(batch_x)

        # Loss computation
        loss = mdn_loss(pi, mu, sigma, batch_y)
        total_loss += loss.item()

        # Backpropagation
        loss.backward()
        optimizer.step()

        batch_time = time.time() - batch_start
        print(
            f"Batch {i:3d}/{len(train_loader)} - Loss: {loss.item():.6f} - Time: {batch_time:.2f}s"
        )

    avg_train_loss = total_loss / len(train_loader)
    epoch_time = time.time() - epoch_start

    # ----- Evaluation -----
    model.eval()
    total_test_loss = 0.0
    with torch.no_grad():
        for batch_x, batch_y in test_loader:
            pi, mu, sigma = model(batch_x)
            test_loss = mdn_loss(pi, mu, sigma, batch_y)
            total_test_loss += test_loss.item()

    avg_test_loss = total_test_loss / len(test_loader)

    # ----- Logging -----
    print(f"\nEpoch [{epoch+1}/{num_epochs}] Summary:")
    print(f"  Train Loss : {avg_train_loss:.6f}")
    print(f"  Test Loss  : {avg_test_loss:.6f}")
    print(f"  Epoch Time : {epoch_time:.2f}s")
    print("-" * 60)
