using System.ComponentModel.DataAnnotations;

namespace LyraBit.Core.DTOs;

public sealed class AddFundsRequestDto
{
    [Required]
    [Range(typeof(decimal), "0.01", "1000000000", ErrorMessage = "Amount must be greater than 0.")]
    public decimal Amount { get; set; }
}
