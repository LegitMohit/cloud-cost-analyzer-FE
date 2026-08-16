"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const recommendedJson = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetReservationCoverage",
        "ce:GetSavingsPlansUtilization",
        "ce:GetDimensionValues",
        "ce:GetTags",
        "ec2:DescribeInstances",
        "ec2:DescribeVolumes",
        "s3:ListBuckets",
        "s3:ListObjects",
        "rds:DescribeDBInstances"
      ],
      "Resource": "*"
    }
  ]
}`;

const fullaccessJson = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GeneralAccess",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:ListRoles",
        "cloudwatch:*",
        "s3:*",
        "ec2:*",
        "rds:*",
        "ce:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PassRoleToRDS",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::<12-digit unique identifier>:role/rds-monitoring-role",
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": "monitoring.rds.amazonaws.com"
        }
      }
    },
    {
      "Sid": "AllowServiceLinkedRole",
      "Effect": "Allow",
      "Action": "iam:CreateServiceLinkedRole",
      "Resource": "arn:aws:iam::*:role/aws-service-role/rds.amazonaws.com/*",
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "rds.amazonaws.com"
        }
      }
    }
  ]
}`;

interface JsonCopyBlockProps {
  json: string;
  copied: boolean;
  onCopy: () => void;
}

function JsonCopyBlock({ json, copied, onCopy }: JsonCopyBlockProps) {
  return (
    <div className="relative w-full max-w-full">
      <button
        onClick={onCopy}
        aria-label="Copy policy JSON to clipboard"
        className="absolute top-0 right-0 p-2 text-zinc-400 hover:text-white transition-colors z-10"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
        ) : (
          <Copy className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
      <pre className="w-full max-w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-4 overflow-auto max-h-[300px]">
        <code className="text-sm text-zinc-300 font-mono block whitespace-pre">{json}</code>
      </pre>
    </div>
  );
}

export default function PolicyBlock() {
  const [policyType, setPolicyType] = useState<"recommended" | "fullaccess">("recommended");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const jsonToCopy = policyType === "recommended" ? recommendedJson : fullaccessJson;
    await navigator.clipboard.writeText(jsonToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Policy type selector">
        <button
          onClick={() => setPolicyType("recommended")}
          aria-pressed={policyType === "recommended"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            policyType === "recommended"
              ? "bg-violet-600 text-white"
              : "bg-[#1E1E2E] text-zinc-400 hover:text-white"
          }`}
        >
          Recommended
        </button>
        <button
          onClick={() => setPolicyType("fullaccess")}
          aria-pressed={policyType === "fullaccess"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            policyType === "fullaccess"
              ? "bg-violet-600 text-white"
              : "bg-[#1E1E2E] text-zinc-400 hover:text-white"
          }`}
        >
          Full Access
        </button>
      </div>

      {policyType === "recommended" && (
        <JsonCopyBlock json={recommendedJson} copied={copied} onCopy={copyToClipboard} />
      )}

      {policyType === "fullaccess" && (
        <JsonCopyBlock json={fullaccessJson} copied={copied} onCopy={copyToClipboard} />
      )}
    </div>
  );
}
