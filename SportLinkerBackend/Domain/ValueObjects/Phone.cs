using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.ValueObjects
{
    public record Phone
    {
        public string Number { get; }
        public string Extension { get; }

        public Phone(string number, string extension)
        {
            if (string.IsNullOrWhiteSpace(number)) throw new ArgumentException("Phone number cannot be empty.");
            if(number.Length != 9) throw new ArgumentException("Phone number must have 9 digits.");
            if (string.IsNullOrWhiteSpace(extension)) throw new ArgumentException("Extension cannot be empty.");
            if (extension.Length > 5) throw new ArgumentException("Extension cannot have more than 5 digits.");

            Number = number;
            Extension = extension;
        }


    }
}
